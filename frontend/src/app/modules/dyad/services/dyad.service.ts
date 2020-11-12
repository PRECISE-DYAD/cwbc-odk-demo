import { Injectable } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import { PRECISE_SCHEMA } from "src/app/modules/precise/models";
import * as IPrecise from "src/app/modules/precise/types";
import { environment } from "src/environments/environment";
import {
  DYAD_SCHEMA,
  IDyadParticipantSummary,
  IDyadParticipantData,
} from "../models/dyad.models";
import { _arrToHashmap } from "../../shared/utils";
import { BehaviorSubject } from "rxjs";
import {
  IFormMeta,
  IFormMetaMappedField,
  IFormMetaWithEntries,
} from "../../shared/types";

/**
 * Create a new object that contains all the mappings selectable from
 * legacy names (e.g. MAPPED_SCHEMA.visit1.tableId = visit1_v2)
 */
const MAPPED_SCHEMA: typeof PRECISE_SCHEMA & typeof DYAD_SCHEMA = {} as any;
Object.entries(DYAD_SCHEMA).forEach(([baseId, value]) => {
  const tableId = environment.tableMapping[baseId] || baseId;
  const formId = environment.formMapping[baseId] || baseId;
  MAPPED_SCHEMA[baseId] = { ...value, tableId, formId };
});

@Injectable({ providedIn: "any" })
/**
 * Note - borrows heavily from precise service. At some point will probably want to merge
 * or create instantiable class
 */
export class DyadService {
  participantSummaries = [];
  activeParticipant: IDyadParticipantSummary;
  activeParticipantData: IDyadParticipantData;
  participantFormsHash: { [tableId: string]: IFormMetaWithEntries };
  private _dataLoaded$ = new BehaviorSubject(false);
  constructor(private odk: OdkService) {
    this.init();
  }

  async init() {
    await this.loadParticipants();
    this._dataLoaded$.next(true);
  }
  /**
   * Promise to indicate when initial data has been loaded
   */
  async isReady() {
    return this._dataLoaded$
      .pipe(takeWhile((ready) => ready === false))
      .toPromise();
  }

  async setActiveParticipantById(f2_guid?: string) {
    if (f2_guid) {
      this.activeParticipant = this.participantSummaries.find(
        (p) => p.f2_guid === f2_guid
      );
      console.log("active participant", this.activeParticipant);
      await this.loadParticipantTableData(this.activeParticipant);
    } else {
      this.activeParticipant = null;
    }
  }

  /**
   * Enrol an existing participant to the Dyad programme, or load a previously
   * opted-out participant for editing
   */
  async enrolParticipant(participant: IDyadParticipantSummary) {
    const { f2_guid, dyad_enrollment } = participant;
    // open form for editing if entry already exists
    const editRowId = dyad_enrollment ? dyad_enrollment._id : null;
    this.launchForm(MAPPED_SCHEMA.dyad_enrollment, editRowId, { f2_guid });
  }

  /**
   * Load all participants availble with Precise profiles and merge with Dyad enrollment data
   */
  private async loadParticipants() {
    await this.odk.ready$.pipe(takeWhile((isReady) => !isReady)).toPromise();
    const dyadProfiles = await this.odk.getTableRows(
      MAPPED_SCHEMA.dyad_enrollment.tableId
    );
    const dyadProfileHash = _arrToHashmap(dyadProfiles, "f2_guid");
    const preciseProfiles = await this.odk.getTableRows<IPrecise.IParticipant>(
      MAPPED_SCHEMA.profileSummary.tableId
    );
    this.participantSummaries = preciseProfiles.map((p) => ({
      ...p,
      dyad_enrollment: dyadProfileHash[p.f2_guid] || null,
    }));
  }

  /**
   * Launch a form in ODK survey, optionally providing an existing rowId to
   * open an existing form (otherwise creates a new entry).
   * Additionally pipe any key-value data pairs to the form, and automatically
   * update piped data when re-opening in edit mode
   * @param editRowId - row to load into survey for editing
   * @param jsonMap - fields to prepopulate
   * NOTE - f2_guid automatically populated for all forms
   * NOTE - any additional fields listed in formMeta also populated
   */
  public async launchForm(
    formMeta: IFormMeta,
    editRowId: string = null,
    jsonMap: any = {}
  ) {
    let { tableId, formId } = formMeta;
    // ensure table and form ids have been properly mapped
    // note - avoid full lookup in case modified mapped fields have been pass (e.g. baby section forms)
    tableId = environment.tableMapping[tableId] || tableId;
    formId = environment.formMapping[formId] || formId;
    if (this.activeParticipant) {
      jsonMap.f2_guid = jsonMap.f2_guid || this.activeParticipant.f2_guid;
    }
    jsonMap = { ...jsonMap, ...this._generateMappedFields(formMeta.mapFields) };
    console.log("launching form", tableId, formId, editRowId, jsonMap);
    if (editRowId) {
      // manually update piped fields in case of changes
      await this.odk.updateRow(tableId, editRowId, jsonMap);
      return this.odk.editRowWithSurvey(tableId, editRowId, formId);
    }
    console.log("adding row", tableId, formId, editRowId, jsonMap);
    return this.odk.addRowWithSurvey(tableId, formId, editRowId, jsonMap);
  }

  /**
   * query batch to get rows from other tables linked by participant guid
   */
  private async loadParticipantTableData(participant: IDyadParticipantSummary) {
    const { f2_guid } = participant;
    const collated: { [tableId: string]: IFormMetaWithEntries } = {};
    const promises = Object.entries(MAPPED_SCHEMA).map(
      async ([key, formMeta]) => {
        const { tableId } = formMeta;
        // lookup the data for every table given by the mapped table id
        let participantRows: any;
        try {
          participantRows = await this.odk.query(
            tableId,
            "f2_guid = ?",
            [f2_guid],
            // skip odk error notifications and just handle below
            (err) => null
          );
        } catch (error) {
          // either table does not exist or no f2_guid field - likely issue but could be exceptions
          console.error(
            "could not query user records:",
            formMeta.tableId,
            f2_guid
          );
        }
        // attach metadata
        collated[tableId] = {
          ...formMeta,
          entries: participantRows || [],
        };
        // duplicate data to pre-mapped table id for use in lookups
        collated[key] = {
          ...formMeta,
          tableId: key,
          entries: participantRows || [],
        };
      }
    );
    await Promise.all(promises);
    console.log("collated", collated);
    this.setParticipantForms(collated);
  }

  /**
   * Separate action from async load code to allow mobx to update synchronously
   * Additionally collate all participant data from forms into a single object, organised by table
   */
  private setParticipantForms(collated: {
    [tableId: string]: IFormMetaWithEntries;
  }) {
    const participantFormsHash = _arrToHashmap(
      Object.values(collated),
      "tableId"
    );
    const activeParticipantData = this._extractMappedDataValues(
      Object.values(participantFormsHash)
    ) as any;
    this.participantFormsHash = participantFormsHash;
    this.activeParticipantData = activeParticipantData;
    console.log("participant forms", participantFormsHash);
  }

  /**
   *  Take the full list of forms and entries for the active participant and collate all values
   *  into nested json for faster lookup.
   *  Additionally include a backwards map so that values can be accessed directly via table map names
   *
   *  NOTE - in the case of multiple entries takes only the most recent
   */
  private _extractMappedDataValues(participantForms: IFormMetaWithEntries[]) {
    const data = {};
    for (const form of participantForms) {
      const { tableId } = form;
      if (!data[tableId]) {
        data[tableId] = {};
      }
      const latestEntry = form.entries[form.entries.length - 1];
      if (latestEntry) {
        Object.entries(latestEntry).forEach(([key, value]) => {
          data[tableId][key] = value;
        });
      }
    }
    return data;
  }

  /**
   * Lookup specific table-field values to pass when launching a form
   * @param mapFields - Array of objects containing table_id, field_name and
   * optional mapped_field_name to retrieve and return
   * NOTE - in case of multiple table entries returns only first entry
   */
  private _generateMappedFields(mapFields: IFormMetaMappedField[] = []) {
    const mapping = {};

    for (const field of mapFields) {
      const { field_name, mapped_field_name, value } = field;
      const fieldName = mapped_field_name || field_name;
      // If value hardcoded (even if ""),simply reutrn
      if (field.hasOwnProperty("value")) {
        mapping[fieldName] = value;
      } else {
        const tableMeta = MAPPED_SCHEMA[field.table_id];
        const { tableId } = tableMeta;
        const entries = this.participantFormsHash[tableId].entries;
        mapping[fieldName] = entries[0] ? entries[0][fieldName] : null;
      }
    }
    return mapping;
  }
}

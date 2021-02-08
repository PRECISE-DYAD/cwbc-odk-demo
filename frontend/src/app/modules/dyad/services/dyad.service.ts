import { Injectable } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import deepEqual from "fast-deep-equal";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import * as IPrecise from "src/app/modules/precise/types";
import { environment } from "src/environments/environment";
import {
  DYAD_SCHEMA,
  IDyadParticipantSummary,
  IDyadParticipantData,
  IDyadTableId,
  DYAD_CHILD_FORM_SECTIONS,
  IDyadParticipantChild,
} from "../models/dyad.models";
import { _arrToHashmap } from "../../shared/utils";
import { BehaviorSubject } from "rxjs";
import { IFormMeta, IFormMetaMappedField, IFormMetaWithEntries } from "../../shared/types";
import { DYAD_SUMMARY_FIELDS, IDyadFieldSummary } from "../models/dyad-summary.model";

/**
 * Create a new object that contains all the mappings selectable from
 * legacy names (e.g. MAPPED_SCHEMA.visit1.tableId = visit1_v2)
 */
const MAPPED_SCHEMA: typeof DYAD_SCHEMA = {} as any;
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
  participantFormsHash: { [tableId in IDyadTableId]: IFormMetaWithEntries };
  activeParticipantData: IDyadParticipantData;
  activeParticipantChildren: IDyadParticipantChild[];
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
    return this._dataLoaded$.pipe(takeWhile((ready) => ready === false)).toPromise();
  }

  async setActiveParticipantById(f2_guid?: string) {
    if (f2_guid) {
      this.activeParticipant = this.participantSummaries.find((p) => p.f2_guid === f2_guid);
      console.log("active participant", this.activeParticipant);
      await this.loadParticipantTableData(this.activeParticipant);
      this.loadParticipantChildMeta();
      await this.updateParticipantSummaryTable();
    } else {
      this.activeParticipant = null;
    }
  }
  /**
   * Evaluate the list of all fieds specified in the dyad_summary_fields model
   * and write to the summary table
   */
  async updateParticipantSummaryTable() {
    const { f2_guid } = this.activeParticipant;
    let summaryEntry = { f2_guid, dyad_summary: {} };
    DYAD_SUMMARY_FIELDS.forEach((f) => {
      const { field, value } = this.evaluateProfileSummaryField(f, this.activeParticipantData);
      summaryEntry.dyad_summary[field] = value;
    });
    console.log("summaryEntry", summaryEntry);
    // when writing object value to database it still must be sent as string
    summaryEntry.dyad_summary = JSON.stringify(summaryEntry.dyad_summary);
    const tableEntries = await this.odk.query("summary", "f2_guid = ?", [f2_guid]);
    if (tableEntries.length > 0) {
      const currentEntry = tableEntries[0];

      // compare changes between proposed update and outstanding doc
      // preserving existing metadata
      const updatedEntry = { ...currentEntry, ...summaryEntry };
      console.log("current entry", currentEntry);
      console.log("updatedEntry", updatedEntry);
      if (!deepEqual(currentEntry, updatedEntry)) {
        this.odk.updateRow("summary", f2_guid, summaryEntry);
      }
    } else {
      this.odk.addRow("summary", summaryEntry, f2_guid);
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
    const dyadProfiles = await this.odk.getTableRows(MAPPED_SCHEMA.dyad_enrollment.tableId);
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
   * Takes a summary calculation object and relevant participant data
   * to calculate a value for the given summary
   * @param summary
   * @param data
   * TODO - code should be merged with field-summary.ts component logic
   */
  private evaluateProfileSummaryField(summary: IDyadFieldSummary, data: IDyadParticipantData) {
    let { tableId, field, calculation, summaryTableFieldname } = summary;
    // direct lookup
    let value: any;
    if (tableId && field) {
      value = data[tableId][field];
    }
    // calculation
    if (calculation) {
      try {
        if (typeof calculation === "string") {
          value = this._parseExpression(data, calculation);
        } else {
          value = calculation(data);
        }
      } catch (error) {
        console.warn("could not evaluate", calculation, error, data);
        value = "ERR";
      }
    }
    // apply any field name changes
    field = summaryTableFieldname || field;
    return { field, value };
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
  public async launchForm(formMeta: IFormMeta, editRowId: string = null, jsonMap: any = {}) {
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
    const collated: {
      [tableId in IDyadTableId]: IFormMetaWithEntries;
    } = {} as any;
    const promises = Object.entries(MAPPED_SCHEMA).map(async ([key, formMeta]) => {
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
        console.error("could not query user records:", formMeta.tableId, f2_guid);
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
    });
    await Promise.all(promises);
    console.log("collated", collated);
    this.setParticipantForms(collated);
  }

  /**
   * Separate action from async load code to allow mobx to update synchronously
   * Additionally collate all participant data from forms into a single object, organised by table
   */
  private setParticipantForms(
    collated: {
      [tableId in IDyadTableId]: IFormMetaWithEntries;
    }
  ) {
    const participantFormsHash = _arrToHashmap(Object.values(collated), "tableId") as any;
    const activeParticipantData = this._extractMappedDataValues(
      Object.values(participantFormsHash)
    ) as any;
    this.participantFormsHash = participantFormsHash;
    this.activeParticipantData = activeParticipantData;
    console.log("participant forms", participantFormsHash);
  }

  /**
   * Create repeat groups for nesting child data based on Birthbaby entries
   * Create formHash with baby entries alongside data object for use in calculations
   */
  private loadParticipantChildMeta() {
    const children: IDyadParticipantChild[] = [];
    // Use birthmother entries to populate children
    for (const entry of this.participantFormsHash.Birthbaby.entries) {
      const { f2_guid_child } = entry;
      // Generate forms hashmap with filtered entry for child
      const formsHash: any = {};
      for (const section of DYAD_CHILD_FORM_SECTIONS) {
        for (const formId of section.formIds) {
          const formMeta = this.participantFormsHash[formId];
          formsHash[formId] = {
            ...formMeta,
            entries: formMeta.entries.filter((e) => e.f2_guid_child === f2_guid_child),
          };
        }
      }
      // populate child data for use in calculation
      const data = this._extractMappedDataValues(Object.values(formsHash)) as any;
      children.push({ formsHash, f2_guid_child, data });
    }
    console.log("participant children", children);
    this.activeParticipantChildren = children;
  }

  /**
   * Create a dynamic function to parse the calculation expression without
   * the nees for `eval()` operator
   */
  private _parseExpression(data: any = {}, str: string) {
    const args = "data, str";
    const body = `'use strict'; return (${str})`;
    return new Function(args, body).apply(null, [data, str]);
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

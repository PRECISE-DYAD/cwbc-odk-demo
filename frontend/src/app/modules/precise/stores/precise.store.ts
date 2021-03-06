import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { observable, action, computed } from "mobx-angular";
import { reaction } from "mobx";
import { OdkService } from "src/app/modules/shared/services";
import {
  IODkTableRowData,
  ODK_META_EXAMPLE,
  IFormMetaWithEntries,
} from "src/app/modules/shared/types";
import {
  IParticipant,
  IParticipantScreening,
  IParticipantSummary,
  IParticipantsHashmap,
  PARTICIPANT_SUMMARY_FIELDS,
} from "../types";
import { _arrToHashmap, _wait, uuidv4 } from "src/app/modules/shared/utils";
import { IFormMeta, IFormMetaMappedField } from "src/app/modules/shared/types";
import { PRECISE_SCHEMA } from "src/app/modules/precise/models";
import { IPreciseParticipantData } from "src/app/modules/precise/models";
import { environment } from "src/environments/environment";
import { takeWhile } from "rxjs/operators";

/**
 * Create a new object that contains all the mappings selectable from
 * legacy names (e.g. MAPPED_SCHEMA.visit1.tableId = visit1_v2)
 */
const MAPPED_SCHEMA: typeof PRECISE_SCHEMA = {} as any;
Object.entries(PRECISE_SCHEMA).forEach(([baseId, value]) => {
  const tableId = environment.tableMapping[baseId] || baseId;
  const formId = environment.formMapping[baseId] || baseId;
  MAPPED_SCHEMA[baseId] = { ...value, tableId, formId };
});
console.log("MAPPED_SCHEMA", MAPPED_SCHEMA);

/**
 * The PreciseStore manages persisted data and operations across the entire application,
 * such as home page, app theme and page titles
 */
@Injectable()
export class PreciseStore {
  constructor(private odk: OdkService) {
    console.log("hello precise store");
    // Ensure odk ready before querying - should always resolve immediately in app but not in dev mode
    this.odk.ready$
      .pipe(takeWhile((isReady) => !isReady))
      .toPromise()
      .then(() => {
        this.loadParticipants();
        this.loadScreeningData();
      });
  }
  allParticipantsHash: IParticipantsHashmap;
  participantFormsHash: { [tableId: string]: IFormMetaWithEntries };

  @observable participantSummaries: IParticipantSummary[];
  @observable screeningData: IParticipantScreening[];
  @observable activeParticipant: IParticipant;
  @observable activeParticipantData: IPreciseParticipantData;
  @observable listDataLoaded = false;
  @observable participantDataLoaded = false;

  @computed get allParticipants() {
    return Object.values(this.allParticipantsHash);
  }

  @action clearActiveParticipant() {
    this.activeParticipant = undefined;
    this.participantFormsHash = undefined;
    this.participantDataLoaded = false;
    this.activeParticipantData = undefined;
  }
  /**
   * Called on initial load, pull full participant data from main table
   * and generate summary to be used within display components
   */
  async loadParticipants() {
    const rows = await this.odk.getTableRows<IParticipant>(MAPPED_SCHEMA.profileSummary.tableId);
    this.setParticipantLists(rows);
  }

  @action async loadScreeningData() {
    const rows = await this.odk.getTableRows<IParticipantScreening>(
      MAPPED_SCHEMA.screening.tableId
    );
    this.screeningData = rows;
  }

  @action setParticipantLists(participantRows: IParticipant[]) {
    this.participantSummaries = Object.values(participantRows).map((p, i) =>
      this._generateParticipantSummary(p, i)
    );
    this.allParticipantsHash = _arrToHashmap(participantRows, "f2_guid");
    this.listDataLoaded = true;
  }

  // used as part of router methods in web preview
  @action async setActiveParticipantById(f2_guid: string, isRetry = false) {
    console.log("setting active participant", f2_guid);
    this.clearActiveParticipant();
    // ensure participants loaded, use a 'reaction' to subscribe to changes,
    // and unsubscribe (dispose) thereafter to avoid memory leak.
    if (!this.allParticipantsHash) {
      return reaction(
        () => this.listDataLoaded,
        (isLoaded, r) => {
          if (isLoaded) {
            r.dispose();
            return this.setActiveParticipantById(f2_guid);
          }
        }
      );
    }
    if (this.allParticipantsHash[f2_guid]) {
      this.activeParticipant = this.allParticipantsHash[f2_guid];
      this.loadParticipantTableData(this.activeParticipant);
    } else {
      // HACK - possibly the data has not been written to the database yet if just created
      // so retry in a second
      if (!isRetry) {
        await _wait(1000);
        await this.loadParticipants();
        return this.setActiveParticipantById(f2_guid, true);
      }
    }
  }
  /**
   * query batch to get rows from other tables linked by participant guid
   */
  async loadParticipantTableData(participant: IParticipant) {
    const { f2_guid } = participant;
    const collated: { [tableId: string]: IFormMetaWithEntries } = {};
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
    this.setParticipantForms(collated);
  }

  /**
   * Separate action from async load code to allow mobx to update synchronously
   * Additionally collate all participant data from forms into a single object, organised by table
   */
  @action setParticipantForms(collated: { [tableId: string]: IFormMetaWithEntries }) {
    const participantFormsHash = _arrToHashmap(Object.values(collated), "tableId");
    const activeParticipantData = this._extractMappedDataValues(
      Object.values(participantFormsHash)
    ) as any;
    this.participantFormsHash = participantFormsHash;
    this.activeParticipantData = activeParticipantData;
    this.participantDataLoaded = true;
    console.log("participant forms", participantFormsHash);
  }

  /**
   * When enrolling a participant we first want to navigate to the
   * profile page that will be generated, so that when the form is complete
   * we will be on the participant page. Launch the enrollment form
   * with the generated ID field complete
   */
  enrolParticipant(router: Router, route: ActivatedRoute, ptid: string) {
    const f2_guid = uuidv4();
    router.navigate([f2_guid], { relativeTo: route });
    return this.launchForm(MAPPED_SCHEMA.profileSummary, null, {
      f2_guid,
      f2a_participant_id: ptid,
    });
  }

  screenNewParticipant(jsonMap = null) {
    return this.launchForm(MAPPED_SCHEMA.screening, null, jsonMap);
  }
  editScreening(screening: IParticipantScreening) {
    const rowId = screening._id;
    this.launchForm(MAPPED_SCHEMA.screening, rowId);
  }

  /**
   * When editing a participant also create a revision entry
   */
  async editParticipant(participant: IParticipant) {
    // TODO - fix errors thrown when editing on local
    await this.backupParticipant(participant);
    const rowId = participant._id;
    this.launchForm(MAPPED_SCHEMA.profileSummary, rowId);
  }
  async withdrawParticipant() {
    // if withdrawal form already exists load again
    const editRowId = this.participantFormsHash.Withdrawal.entries[0]?._id;
    return this.launchForm(MAPPED_SCHEMA.Withdrawal, editRowId);
  }

  /**
   * Compare existing user revisions, creating a backup where no match
   * exists
   */
  async backupParticipant(participant: IParticipant) {
    const newBackup = this._stripOdkMeta(participant);
    const allBackups = this.participantFormsHash.profileSummaryRevisions.entries as any[];
    const latestBackup = this._stripOdkMeta(allBackups[allBackups.length - 1]);
    // Simple object comparison as strings. More complex diffs available
    // via 3rd party libs such as diff, lodash or deep-compare. Skip if same.
    if (JSON.stringify(latestBackup) === JSON.stringify(newBackup)) {
      return;
    }
    const rowId = `${participant._id}_rev_${allBackups.length}`;
    return this.odk.addRow("profileSummaryRevisions", newBackup, rowId);
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
  async launchForm(formMeta: IFormMeta, editRowId: string = null, jsonMap: any = {}) {
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
    return this.odk.addRowWithSurvey(tableId, formId, editRowId, jsonMap);
  }

  /**
   * Rendering full participant data into a table can be slow, even if
   * not all fields set to display. Map participants so only the subset of
   * searchable information is displayed.
   * @param participant Full participant table data
   * NOTE - can possibly be removed as tables only have a few columns
   * (legacy data had over 100)
   */
  private _generateParticipantSummary(participant: IParticipant, index: number) {
    const summary: any = {};
    PARTICIPANT_SUMMARY_FIELDS.forEach((field) => {
      summary[field] = participant[field];
      summary._index = index;
    });
    return summary as IParticipantSummary;
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
      // Ignore automatic checkpoints (null checkpoint) when determining the latest entry
      const savedEntries = form.entries.filter((r) => r._savepoint_type !== null);
      const latestEntry = savedEntries[savedEntries.length - 1];
      // const latestEntry = form.entries[form.entries.length - 1];
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

  private _stripOdkMeta<T>(data: IODkTableRowData & T): T {
    const stripped = { ...data };
    const odkMetaFields = Object.keys(ODK_META_EXAMPLE);
    odkMetaFields.forEach((field) => {
      if (stripped.hasOwnProperty(field)) {
        delete stripped[field];
      }
    });
    return stripped as T;
  }
}

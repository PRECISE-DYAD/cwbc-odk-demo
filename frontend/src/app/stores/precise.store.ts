import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import { OdkService } from "../services/odk/odk.service";
import { reaction } from "mobx";
import { IODkTableRowData, ODK_META_EXAMPLE } from "../types/odk.types";
import { uuidv4 } from "../utils/guid";
import { IFormMeta, IFormMetaMappedField } from "../types/types";
import { PRECISE_SCHEMA } from "../models/precise.models";
import { Router, ActivatedRoute } from "@angular/router";
import { IPreciseParticipantData } from "../models/participant-summary.model";
import { environment } from "src/environments/environment";

/**
 * The PreciseStore manages persisted data and operations across the entire application,
 * such as home page, app theme and page titles
 */
@Injectable()
export class PreciseStore {
  constructor(private odk: OdkService) {
    this.loadParticipants();
    this.loadScreeningData();
  }
  allParticipantsHash: IParticipantsHashmap;
  participantFormsHash;

  @observable participantSummaries: IParticipantSummary[];
  @observable screeningData: IParticipantScreening[];
  @observable activeParticipant: IParticipant;
  @observable activeParticipantData: IPreciseParticipantData;
  @observable participantForms: IFormMetaWithEntries[];
  @observable listDataLoaded = false;
  @observable participantDataLoaded = false;

  @computed get allParticipants() {
    return Object.values(this.allParticipantsHash);
  }

  @action clearActiveParticipant() {
    this.activeParticipant = undefined;
    this.participantForms = undefined;
    this.participantFormsHash = undefined;
    this.participantDataLoaded = false;
    this.activeParticipantData = undefined;
  }
  /**
   * Called on initial load, pull full participant data from main table
   * and generate summary to be used within display components
   */
  async loadParticipants() {
    const rows = await this.odk.getTableRows<IParticipant>(
      this._mapTableId(PRECISE_SCHEMA.profileSummary.tableId)
    );
    this.setParticipantLists(rows);
  }

  @action async loadScreeningData() {
    const rows = await this.odk.getTableRows<IParticipantScreening>(
      this._mapTableId(PRECISE_SCHEMA.screening.tableId)
    );
    this.screeningData = rows;
  }

  @action setParticipantLists(participantRows: IParticipant[]) {
    this.participantSummaries = Object.values(participantRows).map((p, i) =>
      this._generateParticipantSummary(p, i)
    );
    this.allParticipantsHash = this._arrToHashmap(participantRows, "f2_guid");
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
        await this._wait(1000);
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
    const collated: { [tableId: string]: IODkTableRowData[] } = {};
    const tables = Object.keys(PRECISE_SCHEMA);
    const promises = tables.map(async (tableId) => {
      tableId = this._mapTableId(tableId);
      try {
        const particpantRows = await this.odk.query(
          tableId,
          "f2_guid = ?",
          [f2_guid],
          // skip odk error notifications and just handle below
          (err) => null
        );
        collated[tableId] = particpantRows ? particpantRows : [];
      } catch (error) {
        // no data if f2_guid does not exist in the table so can just ignore
      }
    });
    await Promise.all(promises);
    this.setParticipantForms(collated);
  }

  /**
   * Separate action from async load code to allow mobx to update synchronously
   * Additionally collate all participant data from forms into a single object, organised by table
   */
  @action setParticipantForms(collated: {
    [tableId: string]: IODkTableRowData[];
  }) {
    this.participantForms = Object.values(PRECISE_SCHEMA).map((f) => ({
      ...f,
      entries: collated[this._mapTableId(f.tableId)],
    }));
    this.participantFormsHash = this._arrToHashmap(
      this.participantForms,
      "formId"
    );
    this.activeParticipantData = this._extractMappedDataValues(
      this.participantForms
    );
    this.participantDataLoaded = true;
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
    return this.launchForm(PRECISE_SCHEMA.profileSummary, null, {
      f2_guid,
      f2a_participant_id: ptid,
    });
  }

  screenNewParticipant(jsonMap = null) {
    return this.launchForm(PRECISE_SCHEMA.screening, null, jsonMap);
  }
  editScreening(screening: IParticipantScreening) {
    let { tableId, formId } = PRECISE_SCHEMA.screening;
    tableId = this._mapTableId(tableId);
    formId = this._mapFormId(formId);
    const rowId = screening._id;
    this.odk.editRowWithSurvey(tableId, rowId, formId);
  }
  /**
   * When recording a baby also want to populate a guid to link future
   * forms with a specific baby (e.g. in case of twins)
   * This is the same as the mother guid with additional _${childIndex}
   * NOTE1 - child index count from 1 for more human-readable export
   * NOTE2 - optional 'launch' form to allow just generation of ID
   */
  addParticipantBaby(launchForm = true) {
    const childIndex = this.participantFormsHash.Birthbaby.entries.length + 1;
    const { f2_guid } = this.activeParticipant;
    const f2_guid_child = `${f2_guid}_${childIndex}`;
    return launchForm
      ? this.launchForm(PRECISE_SCHEMA.Birthbaby, null, {
          f2_guid_child,
        })
      : f2_guid_child;
  }
  /**
   * When editing a participant also create a revision entry
   */
  async editParticipant(participant: IParticipant) {
    // TODO - fix errors thrown when editing on local
    await this.backupParticipant(participant);
    let { tableId, formId } = PRECISE_SCHEMA.profileSummary;
    tableId = this._mapTableId(tableId);
    formId = this._mapFormId(formId);
    const rowId = participant._id;
    this.odk.editRowWithSurvey(tableId, rowId, formId);
  }
  async withdrawParticipant() {
    return this.launchForm(PRECISE_SCHEMA.Withdrawal);
  }

  /**
   * Compare existing user revisions, creating a backup where no match
   * exists
   */
  async backupParticipant(participant: IParticipant) {
    const newBackup = this._stripOdkMeta(participant);
    const allBackups = this.participantFormsHash.profileSummaryRevisions
      .entries as any[];
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
   *
   * @param editRowId - row to load into survey for editing
   * @param jsonMap - fields to prepopulate
   * NOTE - f2_guid automatically populated for all forms
   * NOTE - any additional fields listed in formMeta also populated
   */
  launchForm(form: IFormMeta, editRowId: string = null, jsonMap: any = {}) {
    let { formId, tableId, mapFields } = form;
    tableId = this._mapTableId(tableId);
    formId = this._mapFormId(formId);
    // pass active participant guid to form if not otherwise defined
    if (this.activeParticipant) {
      jsonMap.f2_guid = jsonMap.f2_guid || this.activeParticipant.f2_guid;
    }
    jsonMap = { ...jsonMap, ...this._generateMappedFields(mapFields) };

    console.log("launching form", tableId, formId, editRowId, jsonMap);

    if (editRowId) {
      return this.odk.editRowWithSurvey(tableId, editRowId, formId);
    }
    return this.odk.addRowWithSurvey(tableId, formId, editRowId, jsonMap);
  }
  /**
   * To more easily allow for changing table names for different sites
   * provide a lookup for modified table names
   */
  private _mapTableId(tableId: string) {
    console.log(
      "map table",
      tableId,
      environment.tableMapping[tableId] || tableId
    );
    return environment.tableMapping[tableId] || tableId;
  }
  private _mapFormId(formId: string) {
    console.log("map form", formId, environment.tableMapping[formId] || formId);
    return environment.formMapping[formId] || formId;
  }

  /**
   * Rendering full participant data into a table can be slow, even if
   * not all fields set to display. Map participants so only the subset of
   * searchable information is displayed.
   * @param participant Full participant table data
   * NOTE - can possibly be removed as tables only have a few columns
   * (legacy data had over 100)
   */
  private _generateParticipantSummary(
    participant: IParticipant,
    index: number
  ) {
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
      const tableId = this._mapTableId(form.tableId);
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
    // assign mapping data
    Object.entries(environment.tableMapping).forEach(([tableId, mappedId]) => {
      data[tableId] = data[mappedId];
    });
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
      console.log("generating mapped field", field);
      const { field_name, mapped_field_name, value } = field;
      const tableId = this._mapTableId(field.table_id);
      const fieldName = mapped_field_name || field_name;
      // do not ignore "" values, test against object properties
      if (field.hasOwnProperty("value")) {
        mapping[fieldName] = value;
      } else {
        console.log("looking up", tableId);
        const { entries } = this.participantFormsHash[tableId];
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
  /**
   * Convert an array to an object with keys corresponding to specific
   * array field
   * @param hashField - field within all array elements to use as hash key
   */
  private _arrToHashmap(arr: any[], hashKey: string) {
    const hash = {};
    arr.forEach((el) => {
      hash[el[hashKey]] = el;
    });
    return hash as any;
  }

  private _wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/********************************************************************************
 * Constants
 ********************************************************************************/

// some fields used in profile form views and search
// _guid used to uniquely identify participant across all forms
const PARTICIPANT_SUMMARY_FIELDS = [
  "_savepoint_timestamp",
  "f2_guid",
  "f2a_participant_id",
  "f2a_national_id",
  "f2a_hdss",
  "f2a_phone_number",
  "f2a_full_name",
] as const;

// list of some fields from screening form used to merge with participant registration
const PARTICIPANT_SCREENING_FIELDS = [
  "f0_0_userID",
  "f0_age",
  "f0_cohort_consented",
  "f0_cohort_existing",
  "f0_consent_status",
  "f0_eligible_cohort",
  "f0_guid",
  "f0_ineligible_continue",
  "f0_precise_id",
  "f0_screen_date",
  "f0_screening_id",
  "f1_1_userID",
  "f1_age",
  "f1_consent_status",
  "f1_screen_date",
] as const;

/********************************************************************************
 * Types
 ********************************************************************************/
// create a type from the list of fields above
type IParticipantSummaryField = typeof PARTICIPANT_SUMMARY_FIELDS[number];
type IParticipantScreeningField = typeof PARTICIPANT_SCREENING_FIELDS[number];

// placeholder interface to reflect all fields available within participant table and ODK meta
export type IParticipant = IODkTableRowData &
  {
    [K in IParticipantSummaryField]: string;
  };

export type IParticipantScreening = IODkTableRowData &
  {
    [K in IParticipantScreeningField]: string;
  };

// summary contains partial participant
export type IParticipantSummary = Partial<IParticipant>;

// hashmap to provide quick lookup of participant by participant id
// tslint:disable interface-over-type-literal
type IParticipantsHashmap = { [f2_guid: string]: IParticipant };

// Participant forms contain full form meta with specific participant entries
export interface IFormMetaWithEntries extends IFormMeta {
  entries: IODkTableRowData[];
}

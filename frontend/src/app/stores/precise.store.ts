import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import { OdkService } from "../services/odk/odk.service";
import { reaction } from "mobx";
import { IODkTableRowData, ODK_META_EXAMPLE } from "../types/odk.types";
import { uuidv4 } from "../utils/guid";
import { IFormMeta, IFormMetaMappedField } from "../types/types";
import { PRECISE_SCHEMA } from "../models/precise.models";

/**
 * The PreciseStore manages persisted data and operations across the entire application,
 * such as home page, app theme and page titles
 */
@Injectable()
export class PreciseStore {
  constructor(private odk: OdkService) {
    this.loadParticipants();
  }
  allParticipantsHash: IParticipantsHashmap;
  participantFormsHash;

  @observable participantSummaries: IParticipantSummary[];
  @observable activeParticipant: IParticipant;
  @observable participantForms: IParticipantForm[];
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
  }
  /**
   * Called on initial load, pull full participant data from main table
   * and generate summary to be used within display components
   */
  async loadParticipants() {
    const rows = await this.odk.getTableRows<IParticipant>(
      PRECISE_SCHEMA.profileSummary.formId
    );
    this.setParticipantLists(rows);
  }
  @action setParticipantLists(participantRows: IParticipant[]) {
    this.participantSummaries = Object.values(participantRows).map((p, i) =>
      this._generateParticipantSummary(p, i)
    );
    this.allParticipantsHash = this._arrToHashmap(
      participantRows,
      "f2a_participant_id"
    );
    this.listDataLoaded = true;
  }

  // used as part of router methods in web preview
  @action setActiveParticipantById(ptid: string) {
    this.clearActiveParticipant();
    // ensure participants loaded, use a 'reaction' to subscribe to changes,
    // and unsubscribe (dispose) thereafter to avoid memory leak.
    if (!this.allParticipantsHash) {
      return reaction(
        () => this.listDataLoaded,
        (isLoaded, r) => {
          if (isLoaded) {
            r.dispose();
            return this.setActiveParticipantById(ptid);
          }
        }
      );
    }
    if (this.allParticipantsHash[ptid]) {
      this.activeParticipant = this.allParticipantsHash[ptid];
      this.loadParticipantTableData(this.activeParticipant);
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
      const particpantRows = await this.odk.query(tableId, "f2_guid = ?", [
        f2_guid,
      ]);
      collated[tableId] = particpantRows ? particpantRows : [];
    });
    await Promise.all(promises);
    this.setParticipantForms(collated);
  }

  /**
   * Separate action from async load code to allow mobx to update synchronously
   */
  @action setParticipantForms(collated: {
    [tableId: string]: IODkTableRowData[];
  }) {
    this.participantForms = Object.values(PRECISE_SCHEMA).map((f) => ({
      ...f,
      entries: collated[f.tableId],
    }));
    this.participantFormsHash = this._arrToHashmap(
      this.participantForms,
      "formId"
    );
    this.participantDataLoaded = true;
  }

  /**
   * Wrapper around more generic launchForm method. Additionally
   * creates globally unique identifier to associate with participant
   * throughout all forms
   */
  addParticipant() {
    const f2_guid = uuidv4();
    return this.launchForm(PRECISE_SCHEMA.profileSummary, null, {
      f2_guid,
    });
  }
  /**
   * When recording a baby also want to populate a guid to link future
   * forms with a specific baby (e.g. in case of twins)
   * This is the same as the mother guid with additional _${childIndex}
   * NOTE - child index count from 1 for more human-readable export
   */
  addParticipantBaby() {
    const childIndex = this.participantFormsHash.Birthbaby.entries.length + 1;
    const { f2_guid } = this.activeParticipant;
    const f2_guid_child = `${f2_guid}_${childIndex}`;
    return this.launchForm(PRECISE_SCHEMA.Birthbaby, null, {
      f2_guid_child,
    });
  }
  /**
   * When editing a participant also create a revision entry
   */
  async editParticipant(participant: IParticipant) {
    // TODO - fix errors thrown when editing on local
    await this.backupParticipant(participant);
    const { tableId, formId } = PRECISE_SCHEMA.profileSummary;
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
    const { formId, tableId, mapFields } = form;
    if (this.activeParticipant) {
      jsonMap.f2_guid = this.activeParticipant.f2_guid;
    }
    jsonMap = { ...jsonMap, ...this._generateMappedFields(mapFields) };

    console.log("launching form", tableId, formId, editRowId, jsonMap);

    if (editRowId) {
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
   * Lookup specific table-field values to pass when launching a form
   * @param fields - Array of objects containing table_id, field_name and
   * optional mapped_field_name to retrieve and return
   * NOTE - in case of multiple table entries returns only first entry
   */
  private _generateMappedFields(fields: IFormMetaMappedField[] = []) {
    const mapping = {};
    for (const field of fields) {
      const { table_id, field_name, mapped_field_name } = field;
      const fieldName = mapped_field_name || field_name;
      const { entries } = (mapping[fieldName] = this.participantFormsHash[
        table_id
      ]);
      mapping[fieldName] = entries[0] ? entries[0][fieldName] : null;
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
}

/********************************************************************************
 * Constants
 ********************************************************************************/

// fields used in summary views and search
// _guid used to uniquely identify participant across all forms
const PARTICIPANT_SUMMARY_FIELDS = [
  "f2_guid",
  "f2a_participant_id",
  "f2a_national_id",
  "f2a_hdss",
  "f2a_phone_number",
  "f2a_full_name",
] as const;

/********************************************************************************
 * Types
 ********************************************************************************/
// create a type from the list of fields above
type IParticipantSummaryField = typeof PARTICIPANT_SUMMARY_FIELDS[number];

// placeholder interface to reflect all fields available within participant table and ODK meta
export type IParticipant = IODkTableRowData &
  {
    [K in IParticipantSummaryField]: string;
  };

// summary contains partial participant
export type IParticipantSummary = Partial<IParticipant>;

// hashmap to provide quick lookup of participant by participant id
// tslint:disable interface-over-type-literal
type IParticipantsHashmap = { [f2a_participant_id: string]: IParticipant };

// Participant forms contain full form meta with specific participant entries
export interface IParticipantForm extends IFormMeta {
  entries: IODkTableRowData[];
}

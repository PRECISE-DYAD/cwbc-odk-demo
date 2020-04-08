import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import { OdkService } from "../services/odk/odk.service";
import { reaction } from "mobx";
import { IODkTableRowData, ODK_META_EXAMPLE } from "../types/odk.types";
import { NotificationService } from "../services/notification/notification.service";
import { uuidv4 } from "../utils/guid";

/**
 * The PreciseStore manages persisted data and operations across the entire application,
 * such as home page, app theme and page titles
 */
@Injectable()
export class PreciseStore {
  constructor(
    private odk: OdkService,
    private notifications: NotificationService
  ) {
    this.loadParticipants();
  }
  @observable allParticipantsHashmap: IParticipantsHashmap;
  @computed get allParticipants() {
    return Object.values(this.allParticipantsHashmap);
  }
  @observable participantSummaries: IParticipantSummary[];
  @observable activeParticipant: IParticipant;
  @observable dataLoaded = false;

  /**
   * Called on initial load, pull full participant data from main table
   * and generate summary to be used within display components
   */
  @action async loadParticipants() {
    const participants = (await this.odk.getTableRows(
      tables.ALL_PARTICIPANTS
    )) as any;
    const merged = this._mergeParticipantRows(participants);
    this.participantSummaries = Object.values(merged).map((p, i) =>
      this.generateParticipantSummary(p, i)
    );
    this.allParticipantsHashmap = merged;
    this.dataLoaded = true;
  }

  // used as part of router methods in web preview
  @action setActiveParticipantById(ptid: string) {
    // skip if already selected
    if (
      this.activeParticipant &&
      this.activeParticipant.f2a_participant_id === ptid
    )
      return;
    // ensure participants loaded, use a 'reaction' to subscribe to changes,
    // and unsubscribe (dispose) thereafter to avoid memory leak.
    if (!this.allParticipantsHashmap) {
      return reaction(
        () => this.dataLoaded,
        (isLoaded, r) => {
          if (isLoaded) {
            r.dispose();
            return this.setActiveParticipantById(ptid);
          }
        }
      );
    }
    this.activeParticipant = this.allParticipantsHashmap[ptid];
  }

  /**
   * Wrapper around more generic launchForm method. Additionally
   * creates globally unique identifier to associate with participant
   * throughout all forms
   */
  addParticipant() {
    const tableId = tables.ALL_PARTICIPANTS;
    const formId = tables.ALL_PARTICIPANTS;
    const f2_guid = uuidv4();
    console.log("f2_guid", f2_guid);
    return this.launchForm(tableId, formId, null, { f2_guid });
  }
  /**
   * When editing a participant also create a revision entry
   */
  async editParticipant(participant: IParticipant) {
    // remove meta fields to create revision
    const tableId = tables.ALL_PARTICIPANTS;
    const formId = tables.ALL_PARTICIPANTS;
    const rowId = participant._id;
    const backup = this._stripOdkMeta(participant);
    console.log("editing participant", participant);
    // TODO - find ways to only create if doesn't already exist
    // Perhaps checking ETags...
    await this.odk.addRow(
      "genInfoRevisions",
      backup,
      rowId,
      (res) => {
        this.notifications.showMessage("backup success");
        console.log("res", res);
        this.odk.editRowWithSurvey(tableId, rowId, formId);
      },
      (err) => {
        this.notifications.handleError(err);
      }
    );
  }
  async getParticipantRevisions() {
    const allRevisions = await this.odk.getTableRows<IParticipant>(
      tables.ALL_PARTICIPANTS__REVISIONS
    );
    console.log("allRevs", allRevisions);
    const participantRevs = allRevisions.filter(
      (rows) => rows._guid === this.activeParticipant.guid
    );
    console.log("participantRevs", participantRevs);
    return participantRevs;
  }
  /**
   *
   * @param editableEntry - include full row details to load data into survey for editing
   * @param jsonMap - fields to prepopulate
   */
  launchForm(
    tableId: string,
    formId: string,
    editableEntry?: IODkTableRowData,
    jsonMap?: any
  ) {
    if (editableEntry) {
      return this.odk.editRowWithSurvey(tableId, editableEntry._id, formId);
    }
    return this.odk.addRowWithSurvey(tableId, formId, null, jsonMap);
  }

  /**
   * Rendering full participant data into a table can be slow, even if
   * not all fields set to display. Map participants so only the subset of
   * searchable information is displayed.
   * @param participant Full participant table data
   */
  private generateParticipantSummary(participant: IParticipant, index: number) {
    const summary: any = {};
    PARTICIPANT_SUMMARY_FIELDS.forEach((field) => {
      summary[field] = participant[field];
      summary._index = index;
    });
    return summary as IParticipantSummary;
  }

  /**
   * Legacy ODK data is split in 3 separate rows per participant
   * Function to merge and return hashmap of results
   * TODO - remove once using new table structures
   */
  private _mergeParticipantRows(
    participants: IParticipant[]
  ): IParticipantsHashmap {
    const merged: IParticipantsHashmap = {};
    participants.forEach((p) => {
      if (!merged[p.f2a_participant_id]) {
        merged[p.f2a_participant_id] = {} as any;
      }
      // avoid overwriting "" fields with falsy check
      Object.entries(p).forEach(([field, fieldValue]) => {
        if (fieldValue) {
          merged[p.f2a_participant_id][field] = fieldValue;
        }
      });
    });
    return merged;
  }

  private _stripOdkMeta<T>(data: IODkTableRowData & T): T {
    // TODO - decide on full meta to remove and move to odk methods
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

/********************************************************************************
 * Constants
 ********************************************************************************/
// mapping to reference different table fields in case of changes
const tables = {
  ALL_PARTICIPANTS: "genInfo",
  ALL_PARTICIPANTS__REVISIONS: "genInfoRevisions",
  LEGACY_DATA: "demoLegacyData",
};
// fields used in summary views and search
// _guid used to uniquely identify participant across all forms
const PARTICIPANT_SUMMARY_FIELDS = [
  "f2_guid",
  "f2a_participant_id",
  "f2a_full_name",
  "f2a_national_id",
  "f2a_hdss",
  "f2a_phone",
  "f2a_phone_number",
  "f2a_phone_2",
  "f2a_phone_number_2",
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

type IParticipantsHashmap = { [ptid: string]: IParticipant };

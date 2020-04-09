import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import { OdkService } from "../services/odk/odk.service";
import { reaction, toJS } from "mobx";
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
  @observable participantCollatedData: IParticipantCollatedData;

  @action clearActiveParticipant() {
    this.activeParticipant = undefined;
    this.participantCollatedData = undefined;
  }

  /**
   * Called on initial load, pull full participant data from main table
   * and generate summary to be used within display components
   */
  @action async loadParticipants() {
    const participantRows = await this.odk.getTableRows<IParticipant>(
      tables.PARTICIPANTS
    );
    this.participantSummaries = Object.values(participantRows).map((p, i) =>
      this.generateParticipantSummary(p, i)
    );
    this.allParticipantsHashmap = this._arrToHashmap(
      participantRows,
      "f2a_participant_id"
    );
    this.dataLoaded = true;
  }

  // used as part of router methods in web preview
  @action setActiveParticipantById(ptid: string) {
    this.clearActiveParticipant();
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
    console.log("activeParticipant", { ...this.activeParticipant });
    this.loadParticipantTableData(this.activeParticipant);
  }
  /**
   * query batch to get rows from other tables linked by participant guid
   */
  @action async loadParticipantTableData(participant: IParticipant) {
    const { f2_guid } = participant;
    // const participantTables = tables.PARTICIPANT_TABLES
    const participantTables = ["genInfo", "genInfoRevisions"];
    const collated: { [tableId: string]: IODkTableRowData[] } = {};
    const promises = participantTables.map(async (tableId) => {
      const particpantRows = await this.odk.query(tableId, "f2_guid = ?", [
        f2_guid,
      ]);
      collated[tableId] = particpantRows;
    });
    await Promise.all(promises);
    console.log("collated", collated);
    this.participantCollatedData = collated;
  }

  /**
   * Wrapper around more generic launchForm method. Additionally
   * creates globally unique identifier to associate with participant
   * throughout all forms
   */
  addParticipant() {
    const tableId = tables.PARTICIPANTS;
    const formId = tables.PARTICIPANTS;
    const f2_guid = uuidv4();
    console.log("f2_guid", f2_guid);
    return this.launchForm(tableId, formId, null, { f2_guid });
  }
  /**
   * When editing a participant also create a revision entry
   */
  async editParticipant(participant: IParticipant) {
    await this.backupParticipant(participant);
    const tableId = tables.PARTICIPANTS;
    const formId = tables.PARTICIPANTS;
    const rowId = participant._id;
    this.odk.editRowWithSurvey(tableId, rowId, formId);
  }

  /**
   * Compare existing user revisions, creating a backup where no match
   * exists
   */
  async backupParticipant(participant: IParticipant) {
    const newBackup = this._stripOdkMeta(participant);
    const allBackups = this.participantCollatedData[
      tables.PARTICIPANTS_REVISIONS
    ];
    const latestBackup = this._stripOdkMeta(allBackups.pop());
    // Simple object comparison as strings. More complex diffs available
    // via 3rd party libs such as diff, lodash or deep-compare. Skip if same.
    if (JSON.stringify(latestBackup) == JSON.stringify(newBackup)) return;
    else {
      console.log("backing up", latestBackup, newBackup);
      const rowId = `${participant._id}_${allBackups.length}`;
      return this.odk.addRow("genInfoRevisions", newBackup, rowId);
    }
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
   * NOTE - can possibly be removed as tables only have a few columns
   * (legacy data had over 100)
   */
  private generateParticipantSummary(participant: IParticipant, index: number) {
    const summary: any = {};
    PARTICIPANT_SUMMARY_FIELDS.forEach((field) => {
      summary[field] = participant[field];
      summary._index = index;
    });
    return summary as IParticipantSummary;
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
    return hash;
  }
}

/********************************************************************************
 * Constants
 ********************************************************************************/
export const PARTICIPANT_FORMS = [
  {
    title: "Precise Visit 1",
    formId: "Visit1",
    tableId: "Visit1",
    icon: "visit",
  },
  {
    title: "Precise Visit 2",
    formId: "Visit2",
    tableId: "Visit2",
    icon: "visit",
  },
  {
    title: "ToD at ANC",
    formId: "tod",
    tableId: "tod",
    icon: "disease",
    disabled: true,
  },
  {
    title: "Birth Mother",
    formId: "birthMother",
    tableId: "birthMother",
    icon: "mother",
    disabled: true,
  },
  {
    title: "Birth Baby",
    formId: "birthBaby",
    tableId: "birthBaby",
    icon: "baby",
    disabled: true,
  },
  {
    title: "Laboratory",
    formId: "lab",
    tableId: "lab",
    icon: "lab",
    disabled: true,
  },
];
// mapping to reference different tables and table groups
const tables = {
  PARTICIPANTS: "genInfo",
  PARTICIPANTS_REVISIONS: "genInfoRevisions",
  PARTICIPANT_TABLES: PARTICIPANT_FORMS.map((f) => f.tableId),
};
// fields used in summary views and search
// _guid used to uniquely identify participant across all forms
const PARTICIPANT_SUMMARY_FIELDS = [
  "f2_guid",
  "f2a_participant_id",
  "f2a_national_id",
  "f2a_hdss",
  "f2a_phone_number",
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
type IParticipantsHashmap = { [f2a_participant_id: string]: IParticipant };

// collated info of all participant data across tables
export type IParticipantCollatedData = {
  [tableId: string]: IODkTableRowData[];
};

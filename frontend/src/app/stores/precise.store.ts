import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import { OdkService } from "../services/odk/odk.service";
import { reaction } from 'mobx';


/**
 * The PreciseStore manages persisted data and operations across the entire application,
 * such as home page, app theme and page titles
 */
@Injectable()
export class PreciseStore {
  constructor(private odk: OdkService) {
    this.loadParticipants();
  }
  @observable allParticipantsHashmap: IParticipantsHashmap;
  @computed get allParticipants() {
    return Object.values(this.allParticipantsHashmap)
  }
  @observable participantSummaries: IParticipantSummary[];
  @observable activeParticipant: IParticipant
  @observable dataLoaded = false

  /**
   * Called on initial load, pull full participant data from main table
   * and generate summary to be used within display components
   */
  @action async loadParticipants() {
    const participants = (await this.odk.getTableRows(
      tables.ALL_PARTICIPANTS
    )) as any;
    const merged = this._mergeParticipantRows(participants)
    this.participantSummaries = Object.values(merged).map((p, i) =>
      this.generateParticipantSummary(p, i)
    );
    this.allParticipantsHashmap = merged;
    this.dataLoaded = true
  }

  // used as part of router methods in web preview
  @action setActiveParticipantById(ptid: string) {
    // skip if already selected
    if (this.activeParticipant && this.activeParticipant.f2a_participant_id === ptid) return
    // ensure participants loaded, use a 'reaction' to subscribe to changes,
    // and unsubscribe (dispose) thereafter to avoid memory leak.
    if (!this.allParticipantsHashmap) {
      return reaction(() => this.dataLoaded, (isLoaded, r) => {
        if (isLoaded) {
          r.dispose()
          return this.setActiveParticipantById(ptid)
        }
      })
    }
    this.activeParticipant = this.allParticipantsHashmap[ptid]
  }

  @action updateParticipant(index: number, value: any) {
    this.allParticipants[index] = value;
    this.participantSummaries[index] = this.generateParticipantSummary(
      value,
      index
    );
  }

  /**
   *
   * @param participantIndex - if choosing to edit an existing participant, specify here
   */
  launchParticipantForm(participantIndex?: number) {
    // TO CONFIRM - INCLUDE ODK META IN TYPES
    const tableId = tables.ALL_PARTICIPANTS;
    const formId = tables.ALL_PARTICIPANTS;
    if (participantIndex) {
      const rowId = this.allParticipants[participantIndex]._rowID;
      return this.odk.editRowWithSurvey(tableId, rowId, formId);
    }
    return this.odk.addRowWithSurvey(tableId, formId);
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
  private _mergeParticipantRows(participants: IParticipant[]): IParticipantsHashmap {
    const merged: IParticipantsHashmap = {}
    participants.forEach(p => {
      if (!merged[p.f2a_participant_id]) {
        merged[p.f2a_participant_id] = {} as any
      }
      // avoid overwriting "" fields with falsy check
      Object.entries(p).forEach(([field, fieldValue]) => {
        if (fieldValue) {
          merged[p.f2a_participant_id][field] = fieldValue
        }
      })
    })
    return merged
  }
}

/********************************************************************************
 * Constants
 ********************************************************************************/
// mapping to reference different table fields in case of changes
const tables = {
  ALL_PARTICIPANTS: "demoDataAll",
};
// fields used in summary views and search
const PARTICIPANT_SUMMARY_FIELDS = [
  "_rowID",
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

// placeholder interface to reflect all fields available within participant table
export type IParticipant = { [K in IParticipantSummaryField]: string };

// summary contains partial participant
export type IParticipantSummary = Partial<IParticipant>

type IParticipantsHashmap = { [ptid: string]: IParticipant }
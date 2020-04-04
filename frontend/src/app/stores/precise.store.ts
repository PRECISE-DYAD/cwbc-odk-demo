import { observable, action } from "mobx-angular";
import { Injectable } from "@angular/core";
import { OdkService } from "../services/odk/odk.service";

/**
 * The PreciseStore manages persisted data and operations across the entire application,
 * such as home page, app theme and page titles
 */
@Injectable()
export class PreciseStore {
  private allParticipants: IParticipant[];

  constructor(private odk: OdkService) {
    this.loadParticipants();
  }

  @observable participantSummaries$: IParticipantSummary[];
  @observable dataLoaded$ = false;
  @observable activeParticipant$: IActiveParticipant;

  /**
   * Called on initial load, pull full participant data from main table
   * and generate summary to be used within display components
   */
  @action async loadParticipants() {
    const participants = (await this.odk.getTableRows(
      tables.ALL_PARTICIPANTS
    )) as any;
    this.participantSummaries$ = participants.map((p, i) =>
      this.generateParticipantSummary(p, i)
    );
    this.allParticipants = participants;
    this.dataLoaded$ = true;
  }
  @action setActiveParticipant(i: number) {
    this.activeParticipant$ = { ...this.allParticipants[i], _index: i };
  }

  @action updateParticipant(index: number, value: any) {
    this.allParticipants[index] = value;
    this.participantSummaries$[index] = this.generateParticipantSummary(
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
export type IParticipant = { [K in IParticipantSummaryField]: boolean };

// when setting a participant as active also retain index within all participants list
interface IActiveParticipant extends IParticipant {
  _index: number;
}

// summary contains partial participant alongside index (for full participant lookup)
export interface IParticipantSummary extends Partial<IParticipant> {
  _index: number;
}

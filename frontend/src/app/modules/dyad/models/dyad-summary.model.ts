// tslint:disable

import { environment } from "src/environments/environment";
import { IDyadTableId } from "./dyad.models";

/**
 * Fields displayed in the profile under the 'summary' tab
 * @Remark - in the case of calculations, if multiple entries exist ONLY THE MOST RECENT will be used
 * TODO - pass back array in cases where multiple entries possible
 */
const SITE = environment.SITE;
export const DYAD_SUMMARY_FIELDS: IDyadFieldSummary[] = [
  {
    label: "PRECISE Cohort",
    tableId: "profileSummary",
    field: "f2a_cohort",
  },
];

switch (SITE) {
  case "gambia":
  case "kenya":
  default:
  /* do nothing here */
}

/**
 * NOTE - in the case of multiple babies unique data is sent each time to calculations
 * and shown within the specific baby section
 */
export const PRECISE_BABY_SUMMARY_FIELDS: IDyadFieldSummary[] = [];

/******************************************************************************************
 * Functions used in calculations
 ******************************************************************************************/

// TEMP function to handle converting older custom template date strings
// e.g. 24/08/2020
// TODO - check if custom template is returning in better format
function _strToDate(str: string) {
  return str ? new Date(str.split("/").reverse().join("-")) : undefined;
}

function _strToDateStr(str: string) {
  return str ? str.split("/").reverse().join("-") : undefined;
}

/******************************************************************************************
 * Interfaces
 *
 * *****************************************************************************************/

/**
 * Calc data is the combination of all data known about a participant,
 * listed as nested json by form. Additionally has a _calcs property
 * that holds any additional intermediate calculations defined above.
 * By default tables that have not been completed by the participant
 * will be an empty json object. E.G.
 * ```
 * data = {
 *  Visit1:{
 *    f2_some_field:'some_value'
 *  },
 *  Visit2:{
 *    f3_another_field: 'another_value'
 *  },
 *  Withdrawal:{},
 *  _calcs:{
 *    ga_today: 23.4
 *  }
 * ```
 */
export type IDyadParticipantData = {
  [tableId in IDyadTableId]: { [field: string]: any };
};

/**
 * Calc data is the combination of all data known about a participant,
 * listed as nested json by form
 * @param label - Text that appears before the value on a form
 * @param tableId - If supplied with a field, will return specific value
 * @param field
 * @param calculation - Function executed to calculate value (with access to participant data object)
 * @param summaryTableFieldname - Additional mapping for populating standalone precise summary table
 * @param hidden - TODO - Hide field from summary
 * ```
 * calculation: (data)=>Math.min(data.Visit1.f2_some_field, data.Visit2.f3_another_field)
 * ```
 * @
 * @param grouping - (WiP) - group fields together (only used in profile table)
 * @param icon - (WiP) - optional icon to appear before text
 * @param transformation - (WiP) - additional transformation to be applied to
 * the final value, such as specific representation for a date (TBC)
 *
 *
 */
export interface IDyadFieldSummary {
  label: string;
  tableId?: IDyadTableId;
  field?: string;
  calculation?: (data: IDyadParticipantData) => string;
  summaryTableFieldname?: string;
  // deprecated or not fully implemented
  hidden?: boolean;
  grouping?: string;
  icon?: string;
  transformation?: string;
}

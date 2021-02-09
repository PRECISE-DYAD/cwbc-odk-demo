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
    label: "PTID",
    tableId: "profileSummary",
    field: "f2a_participant_id",
  },
  {
    label: "Full Name",
    tableId: "profileSummary",
    field: "f2a_full_name",
  },
  {
    label: "HDSS",
    tableId: "profileSummary",
    field: "f2a_hdss",
  },
  {
    label: "Date of delivery",
    tableId: "Birthbaby",
    field: "f9_delivery_date",
  },
  {
    label: "Gestational age at delivery",
    tableId: "Birthbaby",
    field: "f9_ga_at_delivery",
  },
  {
    label: "Mode of Delivery",
    calculation: (data) => mode_of_delivery(data),
  },
  {
    label: "Number of Babies",
    tableId: "Birthmother",
    field: "f7_delivery_num_of_babies",
  },
  {
    label: "Stillbirth in PRECISE pregnancy ",
    calculation: (data) => stillbirth_yn(data),
  },
  {
    label: "Early neonatal death in PRECISE pregnancy",
    calculation: (data) => early_neonatal_death(data),
  },
  {
    label: "Delivery location",
    calculation: (data) => delivery_location(data),
  },
  {
    label: "Ideal date of PRECISE-DYAD visit 1 (6 weeks , 6 months)",
    calculation: (data) => ideal_visit1(data),
  },
  {
    label: "Date of PRECISE-DYAD visit 1",
    tableId: "dyad_visit1",
    field: "gv_visit_date",
  },
  {
    label: "Weeks postpartum at PRECISE-DYAD visit 1",
    calculation: (data) => weeks_postpartum_visit1(data),
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

function mode_of_delivery(data: IDyadParticipantData) {
  let mode_str = "NA";
  let mode_del = data.Birthbaby.f9_mode_of_delivery;
  switch (mode_del) {
    default:
      mode_str = "Don't know";
      return mode_str;
    case "1":
      mode_str = "Unassisted vaginal without episiotomy";
      return mode_str;
    case "2":
      mode_str = "Operative vaginal";
      return mode_str;
    case "3":
      mode_str = "Vaginal breech";
      return mode_str;
    case "4":
      mode_str = "Resuscitative hysterotomy (perimortem CS)";
      return mode_str;
    case "5":
      mode_str = "Unassisted vaginal without episiotomy";
      return mode_str;
    case "6":
      mode_str = "None and the mother died undelivered";
      return mode_str;
    case "7":
      mode_str = "Caesarean section";
      return mode_str;
  }
}

function delivery_location(data: IDyadParticipantData) {
  let location_str = "NA";
  let location = data.Birthmother.f7_delivery_location;
  switch (location) {
    default:
      location_str = "Don’t know";
      return location_str;
    case "1":
      location_str = "Home";
      return location_str;
    case "2":
      location_str = "PHC";
      return location_str;
    case "3":
      location_str = "District hospital";
      return location_str;
    case "4":
      location_str = "Regional hospital";
      return location_str;
    case "5":
      location_str = "Tertiary hospital";
      return location_str;
    case "6":
      location_str = "Private hospital/clinic";
      return location_str;
    case "7":
      location_str = "En route";
      return location_str;
  }
}

function stillbirth_yn(data: IDyadParticipantData) {
  let val = "";

  if (data.Birthbaby.f9_baby_born_alive == "1") {
    val = "Yes";
  } else {
    val = "No";
  }

  return val;
}

function early_neonatal_death(data: IDyadParticipantData) {
  let val = "";

  if (
    data.Birthmother.f7_delivery_location == 1 &&
    data.Birthbaby.f9_baby_born_alive == 1 &&
    data.Birthbaby.f9_baby_alive == 0
  ) {
    val = "Yes";
  } else {
    val = "No";
  }
  return val;
}

function ideal_visit1(data: IDyadParticipantData) {
  //6 weeks to 6 monts after birth
  let del_date = _strToDate(data.Birthbaby.f9_delivery_date);
  let lci_date = new Date(del_date.setDate(del_date.getDate() + 6 * 7)).toISOString().slice(0, 10);
  let hci_date = new Date(del_date.setDate(del_date.getDate() + 4 * 7 * 6))
    .toISOString()
    .slice(0, 10);

  let return_str = "(" + lci_date + " , " + hci_date + ")";

  return return_str;
}

function weeks_postpartum_visit1(data: IDyadParticipantData) {
  let del_date = _strToDate(data.Birthbaby.f9_delivery_date).getTime();
  let weeks_post_partum = "";
  if (data.dyad_visit1.gv_visit_date) {
    let visit_date = _strToDate(data.dyad_visit1.gv_visit_date).getTime();
    weeks_post_partum = ((visit_date - del_date) / (1000 * 60 * 60 * 24 * 7)).toFixed(1);
  }
  return weeks_post_partum;
}

/*if(location == '1'){location_str =  "Home"}
  else if(location == '2'){location_str = "PHC"}
  else if(location == '3'){location_str = "District hospital"}
  else if(location == '4'){location_str = "Regional hospital"}
  else if(location == '5'){location_str =  "Tertiary hospital"}
  else if(location == '6'){location_str =  "Private hospital/clinic"}
  else if(location == '7'){location_str = "En route"}
  else{location_str = "Don’t know"}
  return location_str;
  */

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
 *
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

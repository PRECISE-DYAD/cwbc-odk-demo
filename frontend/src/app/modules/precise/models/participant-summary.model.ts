// tslint:disable

import { environment } from "src/environments/environment";
import { IPreciseTableId } from "./precise.models";

/**
 * Fields displayed in the profile under the 'summary' tab
 * @Remark - in the case of calculations, if multiple entries exist ONLY THE MOST RECENT will be used
 * TODO - pass back array in cases where multiple entries possible
 */
const SITE = environment.SITE;
export const PRECISE_SUMMARY_FIELDS: IPreciseFieldSummary[] = [
  {
    label: "PRECISE Cohort",
    tableId: "profileSummary",
    field: "f2a_cohort",
  },
  {
    label: "Date of PRECISE Visit 1",
    tableId: "Visit1",
    field: "f2_visit_date",
  },
  {
    label: "Gestational Age at Visit 1 (weeks)",
    calculation: (data) => getEDD_GA(data).ga_enrol,
    summaryTableFieldname: "gaaAtVisit1",
  },
  {
    label: "Gestational Age at Today (weeks)",
    calculation: (data) => calculateGAatEvent(data).ga_today,
  },
  {
    label: "Weeks since PRECISE Visit 1",
    calculation: (data) => calculateVisit1ToToday(data),
  },
  {
    label: "<strong>Is eligible for PRECISE Visit 2 today?</strong>",
    calculation: (data) => isTodayForVisit2(data),
  },
  {
    label: "Date of PRECISE Visit 2",
    tableId: "Visit2",
    field: "f2_visit_date",
  },
  {
    label: "Gestational Age at Visit 2 (weeks)",
    calculation: (data) => calculateGAatEvent(data).ga_visit2,
  },
  {
    label: "Estimated Delivery Date",
    calculation: (data) => calculateEDD(data),
  },
  {
    label: "Gestational Age at Delivery (weeks)",
    calculation: (data) => calculateGAatEvent(data).ga_delivery,
  },
  {
    label: "Date of Delivery",
    tableId: "Birthbaby",
    field: "f9_delivery_date",
  },
  {
    label: "Number of Babies",
    tableId: "Birthmother",
    field: "f7_delivery_num_of_babies",
  },
  {
    label: "Lost To Follow-up",
    tableId: "Withdrawal",
    field: "fw_lost_to_followup",
  },
  {
    label: "Withdrawal",
    tableId: "Withdrawal",
    field: "fw_withdraw_from_study",
  },
];

export const PRECISE_PROFILE_FIELDS: IPreciseFieldSummary[] = [
  {
    tableId: "profileSummary",
    field: "f2a_national_id",
    label: "National ID",
    grouping: "Profile",
  },
  {
    tableId: "profileSummary",
    field: "f2a_full_name",
    label: "Name",
    grouping: "Profile",
  },
  {
    tableId: "profileSummary",
    field: "f2a_phone_number",
    label: "Phone 1",
    grouping: "Profile",
  },
  {
    tableId: "profileSummary",
    field: "f2a_phone_number_2",
    label: "Phone 2",
    grouping: "Profile",
  },
  {
    tableId: "Visit1",
    field: "f2_woman_addr",
    label: "Address",
    grouping: "Profile",
  },
  {
    tableId: "profileSummary",
    field: "f2a_hdss",
    label: "HDSS",
    grouping: "Additional",
  },
  {
    tableId: "Visit1",
    field: "f3_year_of_birth",
    label: "Year of Birth",
    grouping: "Additional",
  },
];
switch (SITE) {
  case "gambia":
    PRECISE_PROFILE_FIELDS.push({
      tableId: "Visit1",
      field: "f2_gm_health_facility",
      label: "Health Facility",
      grouping: "Additional",
    });
    PRECISE_PROFILE_FIELDS.push({
      tableId: "Visit1",
      field: "f3_ethnicity_gm",
      label: "Ethnicity",
      grouping: "Additional",
    });
  case "kenya":
    PRECISE_PROFILE_FIELDS.push({
      tableId: "Visit1",
      field: "f2_ke_health_facility",
      label: "Health Facility",
      grouping: "Additional",
    });
    PRECISE_PROFILE_FIELDS.push({
      tableId: "Visit1",
      field: "f3_ethnicity_ke",
      label: "Ethnicity",
      grouping: "Additional",
    });
  default:
  /* do nothing here */
}

/**
 * NOTE - in the case of multiple babies unique data is sent each time to calculations
 * and shown within the specific baby section
 */
export const PRECISE_BABY_SUMMARY_FIELDS: IPreciseFieldSummary[] = [
  {
    label: "Delivery Date",
    calculation: (data) => {
      const { f9_delivery_date, f9_delivery_time } = data.Birthbaby;
      return f9_delivery_date + " : " + f9_delivery_time;
    },
  },
  {
    label: "Is the baby still alive",
    calculation: (data) => {
      if (data.Birthbaby.f9_baby_alive === "1") {
        return "Y";
      }
      if (data.Birthbaby.f9_baby_alive === "0") {
        return "N";
      }
      return "";
    },
  },
];

/******************************************************************************************
 * Functions used in calculations
 ******************************************************************************************/

function calculateVisit1ToToday(data: IPreciseParticipantData) {
  try {
    const d1 = new Date(new Date().toISOString().slice(0, 10)).getTime();
    const d2 = _strToDate(data.Visit1.f2_visit_date).getTime();
    return ((d1 - d2) / (1000 * 60 * 60 * 24 * 7)).toFixed(1);
  } catch (error) {
    console.warn("error in calculateVisit1ToToday", error);
    return undefined;
  }
}

function getEDD_GA(data: IPreciseParticipantData) {
  let ga_enrol = "";
  let ga_method = "None";
  let final_edd = "";
  try {
    //get ultrasound dates
    const dummyDateStr = "1900-01-01";
    const dummyDate = new Date(dummyDateStr);
    const dummyDateCompare = new Date("1900-01-04");
    let ua1_date =
      data.Visit1.f6a_ultrasound1_date &&
      data.Visit1.f6a_ultrasound1_date != dummyDateStr
        ? new Date(data.Visit1.f6a_ultrasound1_date)
        : dummyDate;
    let ua2_date =
      data.Visit1.f6a_ultrasound2_date &&
      data.Visit1.f6a_ultrasound2_date != dummyDateStr
        ? new Date(data.Visit1.f6a_ultrasound2_date)
        : dummyDate;
    let ua3_date =
      data.Visit1.f6a_ultrasound3_date &&
      data.Visit1.f6a_ultrasound3_date != dummyDateStr
        ? new Date(data.Visit1.f6a_ultrasound3_date)
        : dummyDate;
    let ua1_edd =
      data.Visit1.f6a_ultrasound1_edd_date &&
      data.Visit1.f6a_ultrasound1_edd_date != dummyDateStr
        ? new Date(data.Visit1.f6a_ultrasound1_edd_date)
        : dummyDate;
    let ua2_edd =
      data.Visit1.f6a_ultrasound2_edd_date &&
      data.Visit1.f6a_ultrasound2_edd_date != dummyDateStr
        ? new Date(data.Visit1.f6a_ultrasound2_edd_date)
        : dummyDate;
    let ua3_edd =
      data.Visit1.f6a_ultrasound3_edd_date &&
      data.Visit1.f6a_ultrasound3_edd_date != dummyDateStr
        ? new Date(data.Visit1.f6a_ultrasound3_edd_date)
        : dummyDate;
    //make an array object with ultrasound dates and edd
    let date_obj = [
      { edd: ua1_edd, date: ua1_date },
      { edd: ua2_edd, date: ua2_date },
      { edd: ua3_edd, date: ua3_date },
    ];
    //sort array by ultrasound dates, with a dummyDate being the smallest value
    let sorted_ua_dates = date_obj.sort(function (a, b) {
      return a.date.valueOf() - b.date.valueOf();
    });
    //get earliest edd without any dummyDate
    let earliest_edd = dummyDate;
    if (
      sorted_ua_dates[0].date > dummyDateCompare &&
      sorted_ua_dates[0].edd > dummyDateCompare
    ) {
      earliest_edd = sorted_ua_dates[0].edd;
    } else if (
      sorted_ua_dates[1].date > dummyDateCompare &&
      sorted_ua_dates[1].edd > dummyDateCompare
    ) {
      earliest_edd = sorted_ua_dates[1].edd;
    } else if (
      sorted_ua_dates[2].date > dummyDateCompare &&
      sorted_ua_dates[2].edd > dummyDateCompare
    ) {
      earliest_edd = sorted_ua_dates[2].edd;
    } else {
      // Otherwise, get the edd with a dummyDate in U/S date, which should be rare)
      if (earliest_edd < dummyDateCompare) {
        if (sorted_ua_dates[0].edd > dummyDateCompare) {
          earliest_edd = sorted_ua_dates[0].edd;
        } else if (sorted_ua_dates[1].edd > dummyDateCompare) {
          earliest_edd = sorted_ua_dates[1].edd;
        } else if (sorted_ua_dates[2].edd > dummyDateCompare) {
          earliest_edd = sorted_ua_dates[2].edd;
        }
      }
    }

    //compute ga and relevant vars
    let f6a_lmp =
      data.Visit1.f6a_lmp && data.Visit1.f6a_lmp != dummyDateStr
        ? new Date(data.Visit1.f6a_lmp)
        : dummyDate;
    let f2_visit_date =
      data.Visit1.f2_visit_date && data.Visit1.f2_visit_date != dummyDateStr
        ? new Date(data.Visit1.f2_visit_date)
        : dummyDate;
    let sfh =
      data.Visit1.f6a_as_sfh && data.Visit1.f6a_as_sfh != "-99"
        ? parseInt(data.Visit1.f6a_as_sfh)
        : null;

    if (earliest_edd > dummyDateCompare) {
      //if edd not null, use it to get ga
      ga_enrol =
        f2_visit_date > dummyDateCompare
          ? (
              40 -
              (earliest_edd.getTime() - f2_visit_date.getTime()) / 604800000
            ).toFixed(2)
          : " ";
      ga_method = "Ultrasound";
      final_edd = earliest_edd.toISOString().slice(0, 10);
    } else if (f6a_lmp > dummyDateCompare) {
      //if edd is null, use lmp
      ga_enrol =
        f2_visit_date > dummyDateCompare
          ? ((f2_visit_date.getTime() - f6a_lmp.getTime()) / 604800000).toFixed(
              2
            )
          : " ";
      ga_method = "LMP";
      let f_edd = f6a_lmp;
      f_edd.setDate(f6a_lmp.getDate() + 280);
      final_edd = f_edd.toISOString().slice(0, 10);
    } else if (sfh && f2_visit_date) {
      //if lmp missing, use sfh
      ga_enrol = `${sfh}`;
      ga_method = "SFH";
      let s_edd = f2_visit_date;
      s_edd.setDate(s_edd.getDate() + 280 - sfh * 7);
      final_edd = s_edd.toISOString().substring(0, 10);
    } else {
      ga_enrol = "";
      ga_method = "None";
      final_edd = "";
    }
    //ga_enrol = ga_enrol ? ga_enrol + '  weeks' : ''
    return { ga_enrol, ga_method, final_edd };
  } catch (error) {
    console.warn("error in getEDD_GA", error);
    return { ga_enrol, ga_method, final_edd };
  }
}

function calculateEDD(data: IPreciseParticipantData) {
  return getEDD_GA(data).final_edd != ""
    ? `${getEDD_GA(data).final_edd}  by ${getEDD_GA(data).ga_method}`
    : ` `;
}

function calculateGAatEvent(data: IPreciseParticipantData) {
  let ga_delivery = " ";
  let ga_visit2 = " ";
  let ga_today = " ";
  const dummyDateStr = "1900-01-01";
  const dummyDate = new Date(dummyDateStr);
  const dummyDateCompare = new Date("1900-01-04");
  try {
    let edd = getEDD_GA(data).final_edd;
    if (edd) {
      let final_edd = new Date(edd);
      let today = new Date(new Date().toISOString().slice(0, 10));
      ga_today = (
        40 -
        (final_edd.getTime() - today.getTime()) / 604800000
      ).toFixed(2);

      let delivery_date =
        data.Birthbaby.f9_delivery_date &&
        data.Birthbaby.f9_delivery_date != dummyDateStr
          ? new Date(data.Birthbaby.f9_delivery_date)
          : dummyDate;
      let f2_visit_date =
        data.Visit2.f2_visit_date && data.Visit2.f2_visit_date != dummyDateStr
          ? new Date(data.Visit2.f2_visit_date)
          : dummyDate;
      if (delivery_date > dummyDateCompare) {
        ga_delivery = (
          40 -
          (final_edd.getTime() - delivery_date.getTime()) / 604800000
        ).toFixed(2);
      }
      if (f2_visit_date > dummyDateCompare) {
        ga_visit2 = (
          40 -
          (final_edd.getTime() - f2_visit_date.getTime()) / 604800000
        ).toFixed(2);
      }
    }
    return { ga_today, ga_delivery, ga_visit2 };
  } catch (error) {
    console.warn("error in getEDD_GA", error);
    return { ga_today, ga_delivery, ga_visit2 };
  }
}

function isTodayForVisit2(data: IPreciseParticipantData) {
  const dummyDateStr = "1900-01-01";
  const today = new Date(new Date().toISOString().slice(0, 10));
  let result = " ";
  let visit2_date =
    data.Visit2.f2_visit_date && data.Visit2.f2_visit_date != dummyDateStr
      ? new Date(data.Visit2.f2_visit_date)
      : null;
  try {
    const ga_today =
      calculateGAatEvent(data).ga_today &&
      calculateGAatEvent(data).ga_today != " "
        ? +calculateGAatEvent(data).ga_today
        : null;
    const weeksAfterVisit1 = calculateVisit1ToToday(data)
      ? Number(calculateVisit1ToToday(data))
      : null;
    if (ga_today && weeksAfterVisit1) {
      result = ga_today >= 28 && weeksAfterVisit1 >= 4 ? "Yes" : "No";
      if (visit2_date) {
        result = "Visit 2 entered. Check if not sure.";
      } else if (data.Birthbaby.f9_delivery_date) {
        result = "No visit 2 entered (has birth visit)";
      }
    } else {
      result = "No EDD or visit date";
    }
    return result;
  } catch (error) {
    console.warn("error in getEDD_GA", error);
    return " ";
  }
}

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
export type IPreciseParticipantData = {
  [tableId in IPreciseTableId]: { [field: string]: any };
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
export interface IPreciseFieldSummary {
  label: string;
  tableId?: IPreciseTableId;
  field?: string;
  calculation?: (data: IPreciseParticipantData) => string;
  summaryTableFieldname?: string;
  // deprecated or not fully implemented
  hidden?: boolean;
  grouping?: string;
  icon?: string;
  transformation?: string;
}

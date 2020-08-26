// tslint:disable
/**
 * Fields displayed in the profile under the 'summary' tab
 * @Remark - in the case of calculations, if multiple entries exist ONLY THE MOST RECENT will be used
 * TODO - pass back array in cases where multiple entries possible
 */
export const PRECISE_SUMMARY_FIELDS: IPreciseFieldSummary[] = [
  {
    label: "Visit 1 Date",
    tableId: "Visit1",
    field: "f2_visit_date",
  },
  {
    label: "visit2_date",
    tableId: "Visit2",
    field: "f2_visit_date",
  },
  {
    label: "visit1_ga",
    tableId: "Visit1",
    field: "f6a_ga_enrol",
  },
  {
    label: "visit2_ga",
    tableId: "Visit2",
    field: "f2_ga_at_visit",
  },
  {
    label: "birth_ga",
    tableId: "Birthbaby",
    field: "f9_ga_at_delivery",
  },
  {
    label: "delivery_date",
    tableId: "Birthbaby",
    field: "f9_delivery_date",
  },
  {
    label: "number_of_babies",
    tableId: "Birthbaby",
    field: "f7_delivery_num_of_babies",
  },
  {
    label: "LTF",
    tableId: "Withdrawal",
    field: "fw_lost_to_followup",
  },
  {
    label: "withdrawal",
    tableId: "Withdrawal",
    field: "fw_withdraw_from_study",
  },
  {
    label: "Gestational age at today",
    calculation: (data) => calculateGA(data),
  },
  {
    label: "Weeks since PRECISE Visit 1",
    calculation: (data) => calculateVisit1ToToday(data),
  },
];

export const PRECISE_PROFILE_FIELDS: IPreciseFieldSummary[] = [
  {
    tableId: "Visit1",
    field: "f2a_national_id",
    label: "National ID",
    grouping: "Profile",
  },
  {
    tableId: "Visit1",
    field: "f2a_full_name",
    label: "Name",
    grouping: "Profile",
  },
  {
    tableId: "Visit1",
    field: "f2a_phone_number",
    label: "Phone 1",
    grouping: "Profile",
  },
  {
    tableId: "Visit1",
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
    tableId: "Visit1",
    field: "f2_ke_health_facility",
    label: "Health Facility",
    grouping: "Additional",
  },
  {
    tableId: "Visit1",
    field: "f2a_cohort",
    label: "Cohort",
    grouping: "Additional",
  },
  {
    tableId: "Visit1",
    field: "f2a_hdss",
    label: "HDSS",
    grouping: "Additional",
  },
  {
    tableId: "Visit1",
    field: "f3_ethnicity_ke",
    label: "Ethnicity",
    grouping: "Additional",
  },
  {
    tableId: "Visit1",
    field: "f3a_dob",
    label: "DOB",
    grouping: "Additional",
  },
];

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
    const d1 = new Date().getTime();
    const d2 = _strToDate(data.Visit1.f2_visit_date).getTime();
    return ((d1 - d2) / (1000 * 60 * 60 * 24 * 7)).toFixed(1);
  } catch (error) {
    console.warn("error in calculateVisit1ToToday", error);
    return undefined;
  }
}

function calculateGA(data: IPreciseParticipantData) {
  //make an array object with ultrasound dates and edd
  let edds = [];
  for (let i = 0; i < 3; i++) {
    let edd = _strToDate(data.Visit1["f6a_ultrasound" + i + "_edd_date"]);
    if (edd) {
      edds.push(edd);
    }
  }
  //get earliest non-empty edd
  let earliest_edd = edds.sort()[0];
  console.log("edds", edds);
  console.log("earliest_edd", earliest_edd);

  //compute ga and relevant vars
  let ga_enrol: string;
  let f6a_lmp = _strToDate(data.Visit1.f6a_lmp);
  let f2_visit_date = _strToDate(data.Visit1.f2_visit_date);
  let sfh = data.Visit1.f6a_as_sfh;
  if (earliest_edd && f2_visit_date) {
    //if edd not null, use it to get ga
    ga_enrol = (
      40 -
      (earliest_edd.getTime() - f2_visit_date.getTime()) / 604800000
    ).toFixed(2);
  } else if (f6a_lmp && f2_visit_date) {
    //if edd is null, use lmp
    ga_enrol = (
      (f2_visit_date.getTime() - f6a_lmp.getTime()) /
      604800000
    ).toFixed(2);
  } else if (sfh) {
    //if lmp missing, use sfh
    ga_enrol = sfh;
  } else {
    //last case, return empty string to avoid errors
    ga_enrol = " ";
  }
  return `GA_Enrol: ${ga_enrol}`;
}

// TEMP function to handle converting older custom template date strings
// e.g. 24/08/2020
// TODO - check if custom template is returning in better format
function _strToDate(str: string) {
  return str ? new Date(str.split("/").reverse().join("-")) : undefined;
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
  [tableId: string]: { [field: string]: any };
};

/**
 * Calc data is the combination of all data known about a participant,
 * listed as nested json by form
 * @param label - Text that appears before the value on a form
 * @param tableId - If supplied with a field, will return specific value
 * @param field
 * @param calc - String representing alculation required for value.
 * Can call JS functions, and/or access `data` object for parameters, e.g.
 * ```
 * calc: "Math.min(data.Visit1.f2_some_field, data.Visit2.f3_another_field)"
 * ```
 * @param grouping - (WiP) - group fields together (only used in profile table)
 * @param icon - (WiP) - optional icon to appear before text
 * @param transformation - (WiP) - additional transformation to be applied to
 * the final value, such as specific representation for a date (TBC)
 *
 */
export interface IPreciseFieldSummary {
  label: string;
  tableId?: string;
  field?: string;
  calculation?: (data: IPreciseParticipantData) => string;
  grouping?: string;
  icon?: string;
  transformation?: string;
}

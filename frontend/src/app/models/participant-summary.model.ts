// tslint:disable
/**
 * Fields displayed in the profile under the 'summary' tab
 * @Remark - in the case of calculations, if multiple entries exist ONLY THE MOST RECENT will be used
 * TODO - pass back array in cases where multiple entries possible
 */
export const PRECISE_SUMMARY_FIELDS: IPreciseFieldSummary[] = [
  {
    label: "Visit 1 Date",
    calculation: "data.Visit1.f2_visit_date",
  },
  {
    label: "visit2_date",
    calculation: "data.Visit2.f2_visit_date",
  },
  {
    label: "visit1_ga",
    calculation: "data.Visit1.f6a_ga_enrol",
  },
  {
    label: "visit2_ga",
    calculation: "data.Visit2.f2_ga_at_visit",
  },
  {
    label: "birth_ga",
    calculation: "data.Birthbaby.f9_ga_at_delivery",
  },
  {
    label: "delivery_date",
    calculation: "data.Birthbaby.f9_delivery_date",
  },
  {
    label: "number_of_babies",
    calculation: "data.Birthbaby.f7_delivery_num_of_babies",
  },
  {
    label: "LTF",
    calculation: "data.Withdrawal.fw_lost_to_followup",
  },
  {
    label: "withdrawal",
    calculation: "data.Withdrawal.fw_withdraw_from_study",
  },
  {
    label: "Gestational age at today",
    calculation: "data._calcs.ga_today",
  },
  {
    label: "Weeks since PRECISE Visit 1",
    calculation: "data._calcs.visit_1_to_today",
  },
];

/**
 * Additional calculated fields that can be referenced from the PRECISE_SUMMARY_FIELDS list above.
 * These will be merged into the `data` object, and available as data._calcs.calc_name
 * @Remark - longer calculations can also be called as functions
 */
export const PRECISE_SUMMARY_FIELD_CALCS = (data: IPreciseParticipantData) => ({
  ga_today: calculateGA(data),
  visit_1_to_today: calculateVisit1ToToday(data),
});

/******************************************************************************************
 * Functions used in calculations
 ******************************************************************************************/

function calculateVisit1ToToday(data: IPreciseParticipantData) {
  console.log("calc", data.Visit1.f2_visit_date);
  const d1 = new Date().getTime();
  const d2 = _strToDate(data.Visit1.f2_visit_date).getTime();
  return ((d1 - d2) / (1000 * 60 * 60 * 24 * 7)).toFixed(1);
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
  [tableId: string]: { [field: string]: string };
};

/**
 * Calc data is the combination of all data known about a participant,
 * listed as nested json by form
 * @param label - Text that appears before the value on a form
 * @param value - Specific value to show (will not be able to read data values)
 * @param calc - String representing alculation required for value.
 * Can call JS functions, and/or access `data` object for parameters, e.g.
 * ```
 * calc: "Math.min(data.Visit1.f2_some_field, data.Visit2.f3_another_field)"
 * ```
 * @param icon - (WiP) - optional icon to appear before text
 * @param transformation - (WiP) - additional transformation to be applied to
 * the final value, such as specific representation for a date (TBC)
 *
 */
export interface IPreciseFieldSummary {
  label: string;
  value?: string;
  calculation?: string;
  icon?: string;
  transformation?: string;
}

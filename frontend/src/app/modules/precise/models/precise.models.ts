/********************************************************************************
 * Constants
 * These are used to define Precise pages
 ********************************************************************************/

import { environment } from "src/environments/environment";
import {
  IFormMeta,
  IFormMetaMappedField,
  IFormMetaWithEntries,
} from "src/app/modules/shared/types";
const SITE = environment.SITE;

/**
 * Schema where keys represent table ID and values represent form metadata
 * @param icon - Custom icons are placed in `src/assets/icons` and made available
 * by registering in src/app/modules/shared/components/icons.ts
 * @param mapFields - These refer to any additional data that should be passed from, formatted as:
 * ```
 * [{
 *     table_id: "my_table",
 *     field_name: "some_field",
 *     mapped_field_name: "some_other_field" (optional renaming),
 *  }]
 * ```
 * @remark - only supports a single subform for each table
 */
const BirthBabyMapFields: IFormMetaMappedField[] = [
  { table_id: "Visit1", field_name: "f6a_ultrasound1_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound1_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_edd_date" },
  { table_id: "Visit1", field_name: "f6a_lmp" },
  { table_id: "Visit1", field_name: "f6a_as_sfh" },
  { table_id: "Visit1", field_name: "f6a_final_edd" },
  { table_id: "profileSummary", field_name: "f2a_cohort" },
  { table_id: "profileSummary", field_name: "f2a_participant_id" },
  { table_id: "Visit1", field_name: "f6a_ga_enrol" },
  { table_id: "Birthmother", field_name: "f7_delivery_location" },
];
if (SITE == "gambia") {
  BirthBabyMapFields.push({
    table_id: "Visit1",
    field_name: "f2_visit_date",
    mapped_field_name: "visit1_f2_visit_date",
  });
}

const BirthMotherMapFields: IFormMetaMappedField[] = [
  { table_id: "Visit1", field_name: "f6a_ultrasound1_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound1_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_edd_date" },
  { table_id: "Visit1", field_name: "f6a_lmp" },
  { table_id: "Visit1", field_name: "f6a_as_sfh" },
  { table_id: "profileSummary", field_name: "f2a_cohort" },
  { table_id: "profileSummary", field_name: "f2a_participant_id" },
  { table_id: "Visit1", field_name: "f6a_ga_enrol" },
  { table_id: "Visit1", field_name: "f6a_final_edd" },
  { table_id: "Visit1", field_name: "f6a_tod_fgr_cohort" },
  { table_id: "Visit1", field_name: "f6a_tod_hypertension_cohort" },
  { table_id: "Visit1", field_name: "f6a_tod_stillbirth_cohort" },
  { table_id: "Visit2", field_name: "f6a2_tod_fgr_cohort" },
  { table_id: "Visit2", field_name: "f6a2_tod_hypertension_cohort" },
  { table_id: "Visit2", field_name: "f6a2_tod_stillbirth_cohort" },
];
if (SITE == "gambia") {
  BirthMotherMapFields.push({
    table_id: "Visit1",
    field_name: "f2_visit_date",
    mapped_field_name: "visit1_f2_visit_date",
  });
}

const LabMapFields: IFormMetaMappedField[] = [
  { table_id: "profileSummary", field_name: "f2a_cohort" },
  { table_id: "Visit1", field_name: "f6a_ultrasound1_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound1_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_edd_date" },
  { table_id: "Visit1", field_name: "f6a_lmp" },
  { table_id: "Visit1", field_name: "f6a_as_sfh" },
  { table_id: "Visit1", field_name: "f6a_final_edd" },
  { table_id: "profileSummary", field_name: "f2a_participant_id" },
];
if (SITE == "gambia") {
  LabMapFields.push({
    table_id: "Visit1",
    field_name: "f2_visit_date",
    mapped_field_name: "visit1_f2_visit_date",
  });
}

const ToD_ANCMapFields: IFormMetaMappedField[] = [
  { table_id: "profileSummary", field_name: "f2a_cohort" },
  { table_id: "profileSummary", field_name: "f2a_participant_id" },
  { table_id: "Visit1", field_name: "f6a_ultrasound1_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound1_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_edd_date" },
  { table_id: "Visit1", field_name: "f6a_lmp" },
  { table_id: "Visit1", field_name: "f6a_as_sfh" },
  { table_id: "Visit1", field_name: "f6a_final_edd" },
  { table_id: "Visit1", field_name: "f6a_tod_fgr_cohort" },
  { table_id: "Visit1", field_name: "f6a_tod_hypertension_cohort" },
  { table_id: "Visit1", field_name: "f6a_tod_stillbirth_cohort" },
  { table_id: "Visit2", field_name: "f6a2_tod_fgr_cohort" },
  { table_id: "Visit2", field_name: "f6a2_tod_hypertension_cohort" },
];
if (SITE == "gambia") {
  ToD_ANCMapFields.push({
    table_id: "Visit1",
    field_name: "f2_visit_date",
    mapped_field_name: "visit1_f2_visit_date",
  });
}

const Visit2MapFields: IFormMetaMappedField[] = [
  { table_id: "Visit1", field_name: "f6a_ultrasound1_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound1_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound2_edd_date" },
  { table_id: "Visit1", field_name: "f6a_ultrasound3_edd_date" },
  { table_id: "Visit1", field_name: "f6a_lmp" },
  { table_id: "Visit1", field_name: "f6a_as_sfh" },
  { table_id: "profileSummary", field_name: "f2a_cohort" },
  { table_id: "profileSummary", field_name: "f2a_participant_id" },
  { table_id: "Visit1", field_name: "f6a_final_edd" },
  { table_id: "Visit1", field_name: "f6a_tod_fgr_cohort" },
  { table_id: "Visit1", field_name: "f6a_tod_hypertension_cohort" },
  { table_id: "Visit1", field_name: "f6a_tod_stillbirth_cohort" },
];
if (SITE == "gambia") {
  Visit2MapFields.push({
    table_id: "Visit1",
    field_name: "f2_visit_date",
    mapped_field_name: "visit1_f2_visit_date",
  });
}
/**
 * A list of all Precise database tables, used to assist with type checking
 * Note - each of these table ids can have an additional mapping as defined in the environment file,
 * such as adding prefixes or suffixes to the core table name
 */
export const PRECISE_TABLE_IDS = [
  "Birthbaby",
  "Birthmother",
  "profileSummary",
  "profileSummaryRevisions",
  "Lab",
  "Postpartum_baby",
  "Postpartum_mother",
  "screening",
  "TOD_ANC",
  "Visit1",
  "Visit2",
  "Withdrawal",
] as const;
export type IPreciseTableId = typeof PRECISE_TABLE_IDS[number];
export const PRECISE_SCHEMA: { [tableId in IPreciseTableId]: IFormMeta } = {
  Birthbaby: {
    title: "Birth Baby",
    formId: "Birthbaby",
    tableId: "Birthbaby",
    icon: "baby",
    mapFields: BirthBabyMapFields,
  },
  Birthmother: {
    title: "Birth Mother",
    formId: "Birthmother",
    tableId: "Birthmother",
    icon: "mother",
    mapFields: BirthMotherMapFields,
  },
  profileSummary: {
    title: "General Info",
    formId: "profileSummary",
    tableId: "profileSummary",
    icon: "profile",
  },
  profileSummaryRevisions: {
    title: "General Info Revisions",
    formId: "profileSummaryRevisions",
    tableId: "profileSummaryRevisions",
    icon: "history",
  },
  Lab: {
    title: "Laboratory",
    formId: "Lab",
    tableId: "Lab",
    icon: "lab",
    allowRepeats: true,
    mapFields: LabMapFields,
  },
  Postpartum_baby: {
    title: "Postpartum Baby",
    formId: "Postpartum_baby",
    tableId: "Postpartum_baby",
    icon: "baby",
    mapFields: [
      { table_id: "profileSummary", field_name: "f2a_cohort" },
      { table_id: "Visit1", field_name: "f6a_final_edd" },
      { table_id: "profileSummary", field_name: "f2a_participant_id" },
    ],
  },
  Postpartum_mother: {
    title: "Postpartum Mother",
    formId: "Postpartum_mother",
    tableId: "Postpartum_mother",
    icon: "mother",
    mapFields: [
      { table_id: "Visit1", field_name: "f6a_ultrasound1_date" },
      { table_id: "Visit1", field_name: "f6a_ultrasound2_date" },
      { table_id: "Visit1", field_name: "f6a_ultrasound3_date" },
      { table_id: "Visit1", field_name: "f6a_ultrasound1_edd_date" },
      { table_id: "Visit1", field_name: "f6a_ultrasound2_edd_date" },
      { table_id: "Visit1", field_name: "f6a_ultrasound3_edd_date" },
      { table_id: "Visit1", field_name: "f6a_lmp" },
      { table_id: "Visit1", field_name: "f6a_as_sfh" },
      { table_id: "profileSummary", field_name: "f2a_cohort" },
      { table_id: "profileSummary", field_name: "f2a_participant_id" },
      { table_id: "Visit1", field_name: "f6a_ga_enrol" },
      { table_id: "Visit1", field_name: "f6a_final_edd" },
    ],
  },
  screening: {
    title: "Participant Screening",
    formId: "screening",
    tableId: "screening",
    icon: "screen",
  },
  TOD_ANC: {
    title: "ToD at ANC",
    formId: "TOD_ANC",
    tableId: "TOD_ANC",
    icon: "disease",
    allowRepeats: true,
    mapFields: ToD_ANCMapFields,
  },
  Visit1: {
    title: "Precise Visit 1",
    formId: "Visit1",
    tableId: "Visit1",
    icon: "visit",
    mapFields: [
      { table_id: "profileSummary", field_name: "f2a_cohort" },
      { table_id: "profileSummary", field_name: "f2a_participant_id" },
    ],
  },
  Visit2: {
    title: "Precise Visit 2",
    formId: "Visit2",
    tableId: "Visit2",
    icon: "visit",
    mapFields: Visit2MapFields,
  },
  Withdrawal: {
    title: "Withdraw Participant",
    formId: "Withdrawal",
    tableId: "Withdrawal",
    icon: "",
    mapFields: [
      { table_id: "profileSummary", field_name: "f2a_cohort" },
      { table_id: "profileSummary", field_name: "f2a_participant_id" },
    ],
  },
};
/**
 * Subsection created for every new baby registered
 */
export const PRECISE_BABY_FORM_SECTION: IPreciseFormSection = {
  _id: "babySection",
  formIds: ["Birthbaby", "Postpartum_baby"],
};
/**
 * Forms to include with specific sections on profile summary page
 */
export const PRECISE_FORM_SECTIONS: IPreciseFormSection[] = [
  {
    _id: "preciseVisitSection",
    formIds: ["Visit1", "Visit2", "Birthmother", "Postpartum_mother"],
  },
  {
    _id: "todSection",
    formIds: ["TOD_ANC"],
  },
  {
    _id: "labSection",
    formIds: ["Lab"],
  },
];

/********************************************************************************
 * Types
 * These are used to ensure constants defined above are consistently formatted
 ********************************************************************************/
export interface IPreciseFormSection {
  _id: string;
  formIds: IPreciseTableId[];
  label?: string;
}

export interface ISectionWithMeta extends IPreciseFormSection {
  forms: IFormMetaWithEntries[];
}

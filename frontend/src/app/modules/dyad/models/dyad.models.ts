import { IFormMeta, IODkTableRowData } from "src/app/modules/shared/types";
import { IParticipantSummary } from "../../precise/types";

/************************************************************************************
 *  Constants - Used for data population
 ************************************************************************************/
/**
 * Masterlist of all table IDs
 * This is used to check typings on other fields
 */
export const DYAD_TABLE_IDS = [
  "profileSummary",
  "dyad_enrollment",
  "dyad_visit1_mother",
  "dyad_visit1_baby",
] as const;

/**
 * Metadata for DYAD tableIDs.
 */
export const DYAD_SCHEMA: { [tableId in IDyadTableId]: IFormMeta } = {
  // Note, tables accessed from precise data should also be included here to ensure the data is loaded
  profileSummary: {
    title: "General Info",
    formId: "profileSummary",
    tableId: "profileSummary",
  },
  dyad_enrollment: {
    title: "Dyad Enrollment",
    formId: "dyad_enrollment",
    tableId: "dyad_enrollment",
    mapFields: [],
  },
  dyad_visit1_mother: {
    title: "Dyad Visit 1 - Mother",
    formId: "dyad_visit1_mother",
    tableId: "dyad_visit1_mother",
    mapFields: [],
  },
  dyad_visit1_baby: {
    title: "Dyad Visit 1 - Baby",
    formId: "dyad_visit1_baby",
    tableId: "dyad_visit1_baby",
    mapFields: [],
  },
};

/**
 * Forms to include with specific sections on profile summary page
 */
export const DYAD_FORM_SECTIONS: IDyadFormSection[] = [
  {
    _id: "dyadMotherSection",
    formIds: ["dyad_enrollment", "dyad_visit1_mother"],
    label: "Dyad Mother",
    icon: "mother",
  },
];
/**
 * Sub-sections created for every new baby registered
 */
export const DYAD_BABY_FORM_SECTIONS: IDyadFormSection[] = [
  {
    _id: "dyadBabySection",
    formIds: ["dyad_visit1_baby"],
    label: "Dyad Baby",
    icon: "baby",
  },
];

/************************************************************************************
 *  Interfaces used for type-checking
 ************************************************************************************/
export interface IDyadFormSection {
  _id: string;
  formIds: IDyadTableId[];
  label?: string;
  icon?: string;
}
export type IDyadTableId = typeof DYAD_TABLE_IDS[number];
export interface IDyadParticipantSummary extends IParticipantSummary {
  dyad_enrollment: IODkTableRowData;
}
export type IDyadParticipantData = {
  [tableId in IDyadTableId]: { [field: string]: any };
};

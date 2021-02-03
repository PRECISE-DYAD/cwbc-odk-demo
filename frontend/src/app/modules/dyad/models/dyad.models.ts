import {
  IFormMeta,
  IFormMetaWithEntries,
  IODkTableRowData,
} from "src/app/modules/shared/types";
import { IParticipantSummary } from "../../precise/types";

/************************************************************************************
 *  Constants - Used for data population
 ************************************************************************************/
/**
 * Masterlist of all table IDs
 * This is used to check typings on other fields
 */
export const DYAD_TABLE_IDS = [
  "Birthbaby",
  "profileSummary",
  "dyad_enrollment",
  "dyad_child_visit1",
  "dyad_child_visit2",
  "dyad_visit1",
  "dyad_visit2",
  "dyad_visit3",
  "Birthmother",
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
  Birthbaby: {
    title: "Birth Baby",
    formId: "Birthbaby",
    tableId: "Birthbaby",
  },
  Birthmother: {
    title: "Birth Mother",
    formId: "Birthmother",
    tableId: "Birthmother",
  },
  // Main DYAD forms
  dyad_enrollment: {
    title: "Dyad Enrollment",
    formId: "dyad_enrollment",
    tableId: "dyad_enrollment",
    mapFields: [],
  },
  dyad_child_visit1: {
    title: "Dyad Visit 1 - Child",
    formId: "dyad_child_visit1",
    tableId: "dyad_child_visit1",
    mapFields: [],
  },
  dyad_child_visit2: {
    title: "Dyad Visit 2 - Child",
    formId: "dyad_child_visit2",
    tableId: "dyad_child_visit2",
    mapFields: [],
  },
  dyad_visit1: {
    title: "Dyad Visit 1 - Mother",
    formId: "dyad_visit1",
    tableId: "dyad_visit1",
    mapFields: [
      {
        table_id: "Birthmother",
        field_name: "f7_delivery_location",
        mapped_field_name: "f7_delivery_location",
      },
    ],
  },
  dyad_visit2: {
    title: "Dyad Visit 2 - Mother",
    formId: "dyad_visit2",
    tableId: "dyad_visit2",
    mapFields: [],
  },
  dyad_visit3: {
    title: "Dyad Visit 3 - Mother",
    formId: "dyad_visit3",
    tableId: "dyad_visit3",
    mapFields: [],
  },
};

/**
 * Forms to include with specific sections on profile summary page
 */
export const DYAD_FORM_SECTIONS: IDyadFormSection[] = [
  {
    _id: "dyadMotherSection",
    formIds: ["dyad_enrollment", "dyad_visit1", "dyad_visit2", "dyad_visit3"],
    label: "Dyad Mother",
    icon: "mother",
  },
];
/**
 * Sub-sections created for every new baby registered
 */
export const DYAD_CHILD_FORM_SECTIONS: IDyadFormSection[] = [
  {
    _id: "dyadChildSection",
    formIds: ["dyad_child_visit1", "dyad_child_visit2"],
    label: "Dyad Child",
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
/**
 * Child interfaces record nested the same as the active participant data
 */
export interface IDyadParticipantChild {
  f2_guid_child: string;
  formsHash: { [tableId in IDyadTableId]: IFormMetaWithEntries };
  data: IDyadParticipantData;
}

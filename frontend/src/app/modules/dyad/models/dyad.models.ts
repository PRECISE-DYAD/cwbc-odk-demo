import { IFormMeta, IFormMetaWithEntries, IODkTableRowData } from "src/app/modules/shared/types";
import { IParticipantSummary } from "../../precise/types";
import { ICustomIcon } from "../../shared/components/icons";
import { DYAD_SUMMARY_FIELDS } from "./dyad-summary.model";

/************************************************************************************
 *  Constants - Used for data population
 ************************************************************************************/
/**
 * Masterlist of all table IDs
 * This is used to check typings on other fields
 */
export const DYAD_TABLE_IDS = [
  "dyad_consent",
  "dyad_enrollment",
  "dyad_summary",
  "dyad_child_visit1",
  "dyad_child_visit2",
  "dyad_visit1",
  "dyad_visit2",
  // any precise forms references in formulae should be included here
  "Birthbaby",
  "profileSummary",
  "Birthmother",
  "Visit1",
] as const;

/**
 * Metadata for DYAD tableIDs.
 */
const DYAD_SCHEMA_BASE: { [tableId in IDyadTableId]: IFormSchema } = {
  // Note, tables accessed from precise data should also be included here to ensure the data is loaded
  profileSummary: {
    title: "General Info",
  },
  Visit1: {
    title: "Visit1",
  },
  Birthbaby: {
    title: "Birth Baby",
  },
  Birthmother: {
    title: "Birth Mother",
  },
  // Main DYAD forms
  dyad_enrollment: {
    title: "Dyad Enrollment",
    mapFields: [],
  },
  dyad_consent: {
    title: "Dyad Consent",
  },
  dyad_summary: {
    title: "Dyad Summary",
    mapped_json: DYAD_SUMMARY_FIELDS,
    // when showing the dyad_summary include all mapped fields
    // display_summary: [
    //   { field: "clinical_edd", label: "Clinical EDD" },
    //   ...DYAD_SUMMARY_FIELDS.map((f) => ({
    //     label: f.label,
    //     field: `mapped_json.${f.summaryTableFieldname || f.field}`,
    //   })),
    // ],
  },
  dyad_child_visit1: {
    title: "Dyad Visit 1 - Child",
    mapFields: [],
    child_form: true,
  },
  dyad_child_visit2: {
    title: "Dyad Visit 2 - Child",
    mapFields: [],
    child_form: true,
  },
  dyad_visit1: {
    title: "Dyad Visit 1 - Mother",
    mapFields: [
      {
        table_id: "profileSummary",
        field_name: "f2a_phone_number",
        mapped_field_name: "f2a_phone_number",
      },
      {
        table_id: "profileSummary",
        field_name: "f2a_phone_number_2",
        mapped_field_name: "f2a_phone_number_2",
      },
      {
        table_id: "Birthbaby",
        field_name: "f9_mode_of_delivery",
        mapped_field_name: "f9_mode_of_delivery",
      },
      {
        table_id: "Birthbaby",
        field_name: "f9_baby_born_alive",
        mapped_field_name: "f9_baby_born_alive",
      },
      {
        table_id: "Birthbaby",
        field_name: "f9_baby_admitted_route",
        mapped_field_name: "f9_baby_admitted_route",
      },
      {
        table_id: "Birthbaby",
        field_name: "f9_baby_alive",
        mapped_field_name: "f9_baby_alive",
      },
      {
        table_id: "Visit1",
        field_name: "f6a_maternal_height_1st",
        mapped_field_name: "f6a_maternal_height_1st",
      },
      {
        table_id: "Birthmother",
        field_name: "f7_delivery_location",
        mapped_field_name: "f7_delivery_location",
      },
    ],
  },
  dyad_visit2: {
    title: "Dyad Visit 2 - Mother",
    mapFields: [],
  },
};
/** when exporting automatically populate table and form ids when not specified using key */
Object.entries(DYAD_SCHEMA_BASE).forEach(([id, schema]) => {
  schema.tableId = schema.tableId || id;
  schema.formId = schema.formId || id;
});
export const DYAD_SCHEMA = DYAD_SCHEMA_BASE as { [tableId in IDyadTableId]: IFormMeta };

/**
 * Forms to include with specific sections on profile summary page
 */
export const DYAD_FORM_SECTIONS: IDyadFormSection[] = [
  {
    _id: "dyad_profile",
    formIds: ["dyad_consent", "dyad_summary"],
    label: "Dyad Profile",
    icon: "person",
  },
  {
    _id: "dyad_visit_1",
    formIds: ["dyad_enrollment", "dyad_visit1", "dyad_child_visit1"],
    label: "Dyad Visit 1",
    icon: "visit",
  },
  {
    _id: "dyad_visit_2",
    formIds: ["dyad_enrollment", "dyad_visit2", "dyad_child_visit2"],
    label: "Dyad Visit 2",
    icon: "visit",
  },
  {
    _id: "dyad_verbal_autopsy",
    formIds: [],
    label: "Verbal Autopsy",
    icon: "verbal",
  },
  {
    _id: "dyad_end_of_report",
    formIds: [],
    label: "End of Report",
  },
];
/**
 * Sub-sections created for every new baby registered
 */
export const DYAD_CHILD_FORM_SECTIONS: IDyadFormSection[] = [
  // {
  //   _id: "dyadChildSection",
  //   formIds: ["dyad_child_visit1", "dyad_child_visit2"],
  //   label: "Dyad Child",
  //   icon: "baby",
  // },
];

/************************************************************************************
 *  Interfaces used for type-checking
 ************************************************************************************/
export interface IDyadFormSection {
  _id: string;
  formIds: IDyadTableId[];
  label?: string;
  icon?: ICustomIcon;
}

export type IDyadTableId = typeof DYAD_TABLE_IDS[number];
export interface IDyadParticipantSummary extends IParticipantSummary {
  dyad_consent: IODkTableRowData;
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

export interface IFormSchema extends Partial<IFormMeta> {
  title: string;
  /** data can be passed as json to a single `mapped_json` column, as well as individual mapFields */
  mapped_json?: any[];
  /** specify a list of fields to show in the summary display */
  // display_summary?: { field: string; label: string }[];
  /** specify condition to disable the form */
  disabled?: (data: IDyadParticipantData) => boolean;
  /** if form allows repeats, limit maximum entries */
  repeats_limit?: number;
  /** if child form will create a separate instance for every child*/
  child_form?: boolean;
  /** TO CONSIDER - or assume all forms with mapped_json/mapFields will want recalc? */
  calculate_on_load?: boolean;
}

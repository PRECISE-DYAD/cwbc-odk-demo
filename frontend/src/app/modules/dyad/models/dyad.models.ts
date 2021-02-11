import {
  IFormMetaMappedField,
  IFormMetaWithEntries,
  IODkTableRowData,
} from "src/app/modules/shared/types";
import { IParticipantSummary } from "../../precise/types";
import { ICustomIcon } from "../../shared/components/icons";
import { DYAD_SUMMARY_FIELDS, IDyadFieldSummary } from "./dyad-summary.model";

/************************************************************************************
 *  Constants - Used for data population
 ************************************************************************************/
/**
 * Masterlist of all table IDs
 * This is used to type-check other fields
 */
export const DYAD_TABLE_IDS = [
  "dyad_consent",
  "dyad_enrollment",
  "dyad_summary",
  "dyad_child_visit1",
  "dyad_child_visit2",
  "dyad_visit1",
  "dyad_visit2",
  // Any precise forms referenced in formulae should be included here and referenced in DYAD_SCHEMA_BASE.
  // They do not need to be included in the DYAD_FORM_SECTIONS metadata
  "Birthbaby",
  "profileSummary",
  "Birthmother",
  "Visit1",
] as const;

/**
 * Metadata for DYAD tableIDs. See full set of options in IFormSchema below.
 * @see {IFormSchema}
 */
const DYAD_SCHEMA_BASE: { [tableId in IDyadTableId]: IFormSchema } = {
  // Precise forms (required in calculations)
  profileSummary: { title: "General Info" },
  Visit1: { title: "Visit1" },
  Birthbaby: { title: "Birth Baby", is_child_form: true },
  Birthmother: { title: "Birth Mother" },
  // DYAD forms
  dyad_enrollment: { title: "Dyad Visit 1 - Enrollment" },
  dyad_consent: { title: "Dyad Consent" },
  dyad_summary: {
    title: "Dyad Summary",
    mapped_json: DYAD_SUMMARY_FIELDS,
    summary_table_fields: DYAD_SUMMARY_FIELDS,
  },
  dyad_child_visit1: {
    title: "Dyad Visit 1 - Child",
    mapFields: [],
    is_child_form: true,
  },
  dyad_child_visit2: {
    title: "Dyad Visit 2 - Child",
    mapFields: [],
    is_child_form: true,
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

/**
 * Forms to include with specific sections on profile summary page
 * @param formIds - a list of forms to show metadata (including summary tables) from
 * @param label - header text shown at the top of the section
 * @param icon - icon displayed in the header, from a predefined list of available icons
 * @param color - color variant to use (based on primary color), from 1-6. If omitted will be black/white
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
    color: "1",
  },
  {
    _id: "dyad_visit_2",
    formIds: ["dyad_enrollment", "dyad_visit2", "dyad_child_visit2"],
    label: "Dyad Visit 2",
    icon: "visit",
    color: "1",
  },
  {
    _id: "dyad_verbal_autopsy",
    formIds: [],
    label: "Verbal Autopsy",
    icon: "verbal",
    color: "2",
  },
  {
    _id: "dyad_end_of_report",
    formIds: [],
    label: "End of Report",
    icon: "assignment",
    color: "3",
  },
];

/************************************************************************************
 *  Interfaces used for type-checking
 ************************************************************************************/
export interface IDyadFormSection {
  _id: string;
  formIds: IDyadTableId[];
  label?: string;
  icon?: ICustomIcon;
  /** color variants 1-6 are variations on the primary color, if blank will be black/white */
  color?: "1" | "2" | "3" | "4" | "5" | "6";
}

export type IDyadTableId = typeof DYAD_TABLE_IDS[number];
export interface IDyadParticipantSummary extends IParticipantSummary {
  dyad_consent: IODkTableRowData;
}
/**
 * Participant data is saved by table, with top-level referring to latest entry (in case of multiple)
 * and a _rows property which can be used to access additional entries
 */
export type IDyadParticipantData = {
  [tableId in IDyadTableId]: IODkTableRowData & { _rows: IODkTableRowData[] };
};
/**
 * Child interfaces record nested the same as the active participant data
 */
export interface IDyadParticipantChild {
  f2_guid_child: string;
  formsHash: { [tableId in IDyadTableId]: IFormMetaWithEntries };
  data: IDyadParticipantData;
}

// TODO - merge with IFormMeta type definition
export interface IFormSchema {
  title: string;
  /** override the default tableId that will otherwise be populated from the object key */
  tableId?: string;
  /** override the default tableId that will otherwise be populated from the object key */
  formId?: string;
  /** if child form will create a separate instance for every child */
  is_child_form?: boolean;
  /** specify if the form should accept multiple entries from the same participant */
  allowRepeats?: boolean;
  /** specify individual fields to map into the form */
  mapFields?: IFormMetaMappedField[];
  /** data can be passed as json to a single `mapped_json` column, as well as individual mapFields */
  mapped_json?: IDyadFieldSummary[];
  /** specify a list of fields to show in the summary display */
  summary_table_fields?: IDyadFieldSummary[];

  // TODO / Consider additional options //
  /**  - specify condition to disable the form */
  // hidden?: boolean | ((data: IDyadParticipantData) => boolean);
  /** If form allows repeats, limit maximum entries  */
  // repeats_limit?: number;
  /** Determine whether the passed fields should be recalculated on home page load (not just form) */
  // calculate_on_load?: boolean;
}

/************************************************************************************
 *  Additional Export Functions
 ************************************************************************************/
/** when exporting automatically populate table and form ids when not specified using key */
Object.entries(DYAD_SCHEMA_BASE).forEach(([id, schema]) => {
  schema.tableId = schema.tableId || id;
  schema.formId = schema.formId || id;
});
export const DYAD_SCHEMA = DYAD_SCHEMA_BASE as {
  [tableId in IDyadTableId]: IFormSchema & { formId: IDyadTableId; tableId: IDyadTableId };
};

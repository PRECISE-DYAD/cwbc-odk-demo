import { IFormMetaWithEntries, IODkTableRowData } from "src/app/modules/shared/types";
import { IParticipantSummary } from "../../precise/types";
import { ICustomIcon } from "../../shared/components/icons";
import { DYAD_CHILD_SUMMARY_FIELDS, DYAD_SUMMARY_FIELDS } from "./dyad-summary.model";

/************************************************************************************
 *  Constants - Used for data population
 ************************************************************************************/
/**
 * Masterlist of all table IDs
 * This is used to type-check other fields
 */
export const DYAD_tableIdS = [
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
    mapFields: DYAD_SUMMARY_FIELDS,
    summary_table_fields: DYAD_SUMMARY_FIELDS,
  },
  dyad_child_visit1: {
    title: "Dyad Visit 1 - Child",
    mapFields: [],
    is_child_form: true,
    summary_table_fields: DYAD_CHILD_SUMMARY_FIELDS,
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
        tableId: "profileSummary",
        field: "f2a_phone_number",
      },
      {
        tableId: "profileSummary",
        field: "f2a_phone_number_2",
      },
      {
        tableId: "Birthbaby",
        field: "f9_mode_of_delivery",
      },
      {
        tableId: "Birthbaby",
        field: "f9_baby_born_alive",
      },
      {
        tableId: "Birthbaby",
        field: "f9_baby_admitted_route",
      },
      {
        tableId: "Birthbaby",
        field: "f9_baby_alive",
      },
      {
        tableId: "Visit1",
        field: "f6a_maternal_height_1st",
      },
      {
        tableId: "Birthmother",
        field: "f7_delivery_location",
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

export type IDyadTableId = typeof DYAD_tableIdS[number];
export interface IDyadParticipantSummary extends IParticipantSummary {
  dyad_consent: IODkTableRowData;
}
/**
 * Participant data is saved by table, with top-level referring to latest entry (in case of multiple)
 * and a _rows property which can be used to access raw entries
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
/**
 * Form information required to correctly display forms within sections of the app
 * @param title name displayed for form in the app
 * @param tableId override the default tableId that will otherwise be populated from the object key
 * @param formId override the default tableId that will otherwise be populated from the object key
 * @param is_child_form if child form will create a separate instance for every child
 * @param allowRepeats  specify if the form should accept multiple entries from the same participant
 * @param mapFields specify individual fields to map into the form
 * @param mapped_json data can be passed as json to a single `mapped_json` column, as well as individual mapFields
 * @param summary_table_fields specify a list of fields to show in the summary display
 */
export interface IFormSchema {
  title: string;
  tableId?: string;
  formId?: string;
  is_child_form?: boolean;
  allowRepeats?: boolean;
  mapFields?: IDyadMappedField[];
  summary_table_fields?: IDyadMappedField[];
  // mapped_json?: IDyadFieldSummary[];

  // TODO - Consider additional options
  /**  - specify condition to disable the form */
  // hidden?: boolean | ((data: IDyadParticipantData) => boolean);
  /** If form allows repeats, limit maximum entries  */
  // repeats_limit?: number;
  /** Determine whether the passed fields should be recalculated on home page load (not just form) */
  // calculate_on_load?: boolean;
}

/**
 * Field mappings can can be used to display data, or pipe into a table. Values can either be calculated from
 * a collation of all participant data, or a single table field value
 * @param label Text that appears before the value on a form
 * @param tableId If supplied with a field, will return specific value
 * @param field Name of field to
 * @param calculation Function executed to calculate value (with access to participant data object)
 * @param mapped_field Rename the field when mapped into a table
 * @param write_updates By default values are only written to a mapped table when the corresponding survey is opened,
 * depending on whether instance_id has changed. Override this behaviour and write changes directly to the database
 * whenever detected.
 * ```
 * calculation: (data)=>Math.min(data.Visit1.f2_some_field, data.Visit2.f3_another_field)
 * calculation: (data)=>data.Birthbaby._rows.length
 * ```
 */
export interface IDyadMappedField {
  label?: string;
  tableId?: IDyadTableId;
  field?: string;
  calculation?: (data: IDyadParticipantData) => string | number;
  mapped_field_name?: string;
  write_updates?: boolean;
}

export interface IFormSchemaWithEntries extends IFormSchema {
  entries: IODkTableRowData[];
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

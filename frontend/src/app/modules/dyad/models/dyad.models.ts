import { IODkTableRowData } from "src/app/modules/shared/types";
import { IParticipantSummary } from "../../precise/types";
import { ICustomIcon } from "../../shared/components/icons";
import { DYAD_RANDOMISATION_SCHEMA } from "./dyad-randomisation.model";
import {
  DYAD_CHILD_VISIT1_FIELDS,
  DYAD_SUMMARY_FIELDS,
  DYAD_CHILD_VA_FIELDS,
  hasProvidedDyadConsent,
} from "./dyad-summary.model";

/**
 * General Note - many of the types here started from precise typings, but were then changed without changing precise
 * (e.g. formMeta vs formSchema). As such not all the same methods can be applied to precise methods.
 * In the future they should be merged and made consistent
 */

/************************************************************************************
 *  Constants - Used for data population
 ************************************************************************************/
/**
 * Masterlist of all table IDs
 * This is used to type-check other fields
 */
export const DYAD_tableIdS = [
  "dyad_consent",
  "dyad_enrollment_visit1",
  "dyad_enrollment_visit2",
  "dyad_summary",
  "dyad_child_visit1",
  "dyad_child_visit2",
  "dyad_visit1",
  "dyad_visit2",
  "dyad_general_info_visit1",
  "dyad_general_info_visit2",
  "MDAT",
  "mother_verbal_autopsy",
  "child_verbal_autopsy",
  "dyad_end_report_visit1",
  "dyad_end_report_visit2",
  "dyad_randomisation",
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
  // Device forms (listed in other file)
  dyad_randomisation: DYAD_RANDOMISATION_SCHEMA,
  // DYAD forms
  dyad_enrollment_visit1: {
    title: "Dyad Visit 1 - Enrolment",
    disabled: (data) => {
      if (!hasProvidedDyadConsent(data)) {
        return "User has not provided Dyad consent";
      }
    },
  },
  dyad_enrollment_visit2: {
    title: "Dyad Visit 2 - Enrolment",
    disabled: (data) => {
      if (!hasProvidedDyadConsent(data)) {
        return "User has not provided Dyad consent";
      }
    },
  },
  dyad_consent: { title: "Dyad Confirmation" },
  dyad_summary: {
    title: "Dyad Summary",
    mapFields: DYAD_SUMMARY_FIELDS,
    show_summary_table: true,
    allow_new_mapFields_row: true,
    disabled: (data) => {
      if (!hasProvidedDyadConsent(data)) {
        return "User has not provided Dyad consent";
      }
    },
  },
  dyad_child_visit1: {
    title: "Dyad Visit 1 - Child",
    mapFields: DYAD_CHILD_VISIT1_FIELDS,
    is_child_form: true,
    show_summary_table: true,
    disabled: (data) => {
      if (!hasProvidedDyadConsent(data)) {
        return "User has not provided Dyad consent";
      }
    },
  },
  dyad_child_visit2: {
    title: "Dyad Visit 2 - Child",
    mapFields: [],
    is_child_form: true,
    disabled: (data) => {
      if (!hasProvidedDyadConsent(data)) {
        return "User has not provided Dyad consent";
      }
      const visit1Entries = data.dyad_child_visit1._rows.length;
      if (visit1Entries === 0) {
        return "Please complete visit 1 first";
      }
    },
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
      {
        tableId: "dyad_general_info_visit1",
        field: "gv_present_at_visit",
      },
      {
        tableId: "dyad_general_info_visit1",
        field: "gv_pregnant",
      },
      {
        tableId: "dyad_general_info_visit1",
        field: "gv_ke_village",
      },
      {
        tableId: "dyad_general_info_visit1",
        field: "gv_sum_visit1_date",
      },
    ],
    disabled: (data) => {
      if (data.dyad_consent.d1_enroll_consent !== "1") {
        return "The participant requires consent first";
      }

      // if (!hasProvidedDyadConsent(data)) {
      //   return "User has not provided Dyad consent";
      // }
    },
  },
  dyad_visit2: {
    title: "Dyad Visit 2 - Mother",
    mapFields: [],
    disabled: (data) => {
      if (!hasProvidedDyadConsent(data)) {
        return "User has not provided Dyad consent";
      }
      const visit1Entries = data.dyad_visit1._rows;
      if (visit1Entries.length === 0) {
        return "Please complete visit1 first";
      }
    },
  },
  dyad_general_info_visit1: {
    title: "Dyad Visit 1 - General Information",
    mapFields: [
      {
        tableId: "profileSummary",
        field: "f2a_phone_number",
      },
      {
        tableId: "profileSummary",
        field: "f2a_phone_number_2",
      },
    ],
  },
  dyad_general_info_visit2: {
    title: "Dyad Visit 2 - General Information",
    mapFields: [
      {
        tableId: "profileSummary",
        field: "f2a_phone_number",
      },
      {
        tableId: "profileSummary",
        field: "f2a_phone_number_2",
      },
    ],
  },
  dyad_end_report_visit1: { title: "Visit 1 - End report" },
  dyad_end_report_visit2: { title: "Visit 2 - End report" },
  child_verbal_autopsy: {
    title: "Child Verbal Autopsy",
    mapFields: DYAD_CHILD_VA_FIELDS,
    is_child_form: true,
    show_summary_table: true,
  },
  mother_verbal_autopsy: { title: "Mother Verbal Autopsy" },
  MDAT: { title: "MDAT", is_child_form: true },
};

/**
 * Forms to include with specific sections on profile summary page
 * @see {IDyadFormSection}
 */
export const DYAD_FORM_SECTIONS: IDyadFormSection[] = [
  {
    _id: "dyad_profile",
    formIds: ["dyad_consent", "dyad_summary"],
    section_title: "Dyad Profile",
    icon: "person",
  },
  {
    _id: "dyad_visit_1",
    formIds: [
      "dyad_randomisation",
      "dyad_enrollment_visit1",
      "dyad_general_info_visit1",
      "dyad_visit1",
      "dyad_child_visit1",
      "dyad_end_report_visit1",
      "MDAT",
    ],
    section_title: "Dyad Visit 1",
    icon: "visit",
    color: "1",
  },
  {
    _id: "dyad_visit_2",
    formIds: [
      "dyad_enrollment_visit2",
      "dyad_general_info_visit2",
      "dyad_visit2",
      "dyad_child_visit2",
      "dyad_end_report_visit2",
      "MDAT",
    ],
    section_title: "Dyad Visit 2",
    icon: "visit",
    color: "1",
  },
  {
    _id: "dyad_verbal_autopsy",
    formIds: ["mother_verbal_autopsy", "child_verbal_autopsy"],
    section_title: "Verbal Autopsy",
    icon: "verbal",
    color: "2",
  },
];

/************************************************************************************
 *  Interfaces used for type-checking
 ************************************************************************************/
/**
 * @param formIds - a list of forms to show metadata (including summary tables) from
 * @param section_title - header text shown at the top of the section
 * @param icon - icon displayed in the header, from a predefined list of available icons
 * @param color - color variant to use (based on primary color), from 1-6. If omitted will be black/white
 */
export interface IDyadFormSection {
  _id: string;
  formIds: IDyadTableId[];
  section_title?: string;
  icon?: ICustomIcon;
  /** color variants 1-6 are variations on the primary color, if blank will be black/white */
  color?: "1" | "2" | "3" | "4" | "5" | "6";
}

export type IDyadTableId = typeof DYAD_tableIdS[number];

/**
 * On first load participant data is retrieved for all participants for only 2 tables,
 * before retrieving full data on participant load
 */
export interface IDyadParticipantSummary {
  dyad_consent: IODkTableRowData;
  precise_profileSummary: IParticipantSummary;
}

/**
 * Participant data is saved by table, with top-level referring to latest entry (in case of multiple).
 * Each table has a _rows property to access raw data in case of multiple entries
 * If the table is a child table it will also contain a _mother property that can access parent data
 */
export interface IDyadParticipantData extends IDyadTableData {
  _mother?: { [tableId in IDyadTableId]: IOdkTableRowDataWithRawRows };
  _device_id: string;
}
type IDyadTableData = { [tableId in IDyadTableId]: IOdkTableRowDataWithRawRows };

/** Participant data also contains a _rows property that provides raw data entries */
export interface IOdkTableRowDataWithRawRows extends IODkTableRowData {
  _rows: IODkTableRowData[];
}
/**
 * Child interfaces record nested the same as the active participant data
 */
export interface IDyadParticipantChild {
  f2_guid_child: string;
  formsHash: { [tableId in IDyadTableId]: IFormSchemaWithEntries };
  data: IDyadParticipantData;
  mother: IDyadParticipant;
  device_id: string;
}

export interface IDyadParticipant {
  f2_guid: string;
  formsHash: { [tableId in IDyadTableId]: IFormSchemaWithEntries };
  data: IDyadParticipantData;
  children: IDyadParticipantChild[];
  device_id: string;
}

// TODO - merge with IFormMeta type definition
/**
 * Form information required to correctly display forms within sections of the app
 * @param title name displayed for form in the app
 * @param tableId override the default tableId that will otherwise be populated from the object key
 * @param formId override the default tableId that will otherwise be populated from the object key
 * @param is_child_form if child form will create a separate instance for every child
 * @param is_device_form if using device form data returned will consist of all rows for the device, not just the active participant's
 * @param allowRepeats  specify if the form should accept multiple entries from the same participant
 * @param mapFields specify individual fields to map into the form
 * @param disabled provide a calculation to determine if the form should be disabled. Any string or TRUE response
 * will indicate the form should be disabled, and if a string the text will be shown as a notification
 * @param show_summary_table if set to true, any fields specified in mapFields with a summary_label column will be shown in a summary table
 * @param allow_mapFields_new_row if form contains mapFields that write directly to the db,
 * also allow creation of new row to hold data if does not exist
 */
export interface IFormSchema {
  title: string;
  tableId?: string;
  formId?: string;
  is_child_form?: boolean;
  is_device_form?: boolean;
  allowRepeats?: boolean;
  mapFields?: IDyadMappedField[];
  disabled?: (data: IDyadParticipantData) => string | boolean | void;
  show_summary_table?: boolean;
  allow_new_mapFields_row?: boolean;
}

/**
 * Field mappings can can be used to display data, or pipe into a table. Values can either be calculated from
 * a collation of all participant data, or a single table field value
 * @param summary_label If provided, will display in the summary table with corresponding summary_label
 * @param tableId If supplied with a field, will return specific value
 * @param field Name of field to
 * @param calculation Function executed to calculate value (with access to participant data object)
 * @param mapped_field Rename the field when mapped into a table
 * @param write_updates By default values are only written to a mapped table when the corresponding survey is opened,
 * depending on whether instance_id has changed. Override this behaviour and write changes directly to the database
 * whenever detected.
 * NOTE - by default this will not create rows when they do not already exist, except for dyad_summary table
 *
 * @example // calculation statements
 * calculation: (data)=>Math.min(data.Visit1.f2_some_field, data.Visit2.f3_another_field)
 *
 * @example // access data when multiple row entries exist
 * calculation: (data)=> const totalRows = data.table1._rows.length ...
 *
 * @example // access mother data from a child form
 * calculation: (data) => data.childTable._mother.motherTable.id
 *
 * @example // pass a calculated value into the form on form open (do not show in the summary table)
 * calculation: (data) => data.table1.first_name + ' ' + data.table1.last_name,
 * mapped_field_name: "participant_name"
 *
 * @example // pass a calculated value into the form on form open and re-evaluate every load
 * calculation: (data) => data.table1.first_name + ' ' + data.table1.last_name,
 * mapped_field_name: "participant_name",
 * write_updates: true
 *
 * @example // show a value in a summary table (but do not map to the form)
 * calculation: (data) =>data.table2.name_of_town
 * summary_label: "Participant Town"
 *
 * @example // map a single field from a table into the form, and show in the summary table
 * tableId: "table2",
 * field: "name_of_town",
 * summary_label: "Participant Town"
 * // (Note the same can be achieved with a calculation statement if mapped_field also included)
 */
export interface IDyadMappedField {
  summary_label?: string;
  tableId?: IDyadTableId;
  field?: string;
  calculation?: (data: IDyadParticipantData) => string | number;
  mapped_field_name?: string;
  write_updates?: boolean;
}

export interface IFormSchemaWithEntries extends IFormSchema {
  entries: IODkTableRowData[];
  // formSchema disabled field as evaulated is stored in _disabled
  _disabled?: boolean;
  _disabled_msg?: string;
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

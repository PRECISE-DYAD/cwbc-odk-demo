/********************************************************************************
 * Constants
 * These are used to define Precise pages
 ********************************************************************************/

import { IParticipantForm } from "../stores";

/**
 * Schema where keys represent table ID and values represent form metadata
 * @param icon - Custom icons are placed in `src/assets/icons` and made available
 * by registering in src/app/components/icons.ts
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
export const PRECISE_SCHEMA = {
  Birthbaby: {
    title: "Birth Baby",
    formId: "Birthbaby",
    tableId: "Birthbaby",
    icon: "baby",
  },
  Birthmother: {
    title: "Birth Mother",
    formId: "Birthmother",
    tableId: "Birthmother",
    icon: "mother",
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
  },
  Postpartum_baby: {
    title: "Postpartum Baby",
    formId: "Postpartum_baby",
    tableId: "Postpartum_baby",
    icon: "baby",
  },
  Postpartum_mother: {
    title: "Postpartum Mother",
    formId: "Postpartum_mother",
    tableId: "Postpartum_mother",
    icon: "mother",
  },
  TOD_ANC: {
    title: "ToD at ANC",
    formId: "TOD_ANC",
    tableId: "TOD_ANC",
    icon: "disease",
    allowRepeats: true,
  },
  Visit1: {
    title: "Precise Visit 1",
    formId: "Visit1",
    tableId: "Visit1",
    icon: "visit",
  },
  Visit2: {
    title: "Precise Visit 2",
    formId: "Visit2",
    tableId: "Visit2",
    icon: "visit",
  },
  Withdrawal: {
    title: "Withdraw Participant",
    formId: "Withdrawal",
    tableId: "Withdrawal",
    icon: "",
  },
};

/**
 * Sections shown on front participant page
 */
export const PRECISE_FORM_SECTIONS: IPreciseFormSection[] = [
  {
    icon: "visit",
    label: "Precise Visit",
    formIds: ["Visit1", "Visit2", "Birthmother", "Postpartum_mother"],
  },
  {
    icon: "disease",
    label: "TOD",
    formIds: ["TOD_ANC"],
  },
  {
    icon: "lab",
    label: "Lab",
    formIds: ["Lab"],
  },
];
/**
 * Subsection created for every new baby registered
 */
export const PRECISE_BABY_FORM_SECTION: IPreciseFormSection = {
  icon: "baby",
  label: "Baby",
  formIds: ["Birthbaby", "Postpartum_baby"],
};

/********************************************************************************
 * Types
 * These are used to ensure constants defined above are consistently formatted
 ********************************************************************************/
type IPreciseFormId = keyof typeof PRECISE_SCHEMA;

export interface IPreciseFormSection {
  // id purely used to later allow adjusting baby form section
  _id?: string;
  icon: string;
  label: string;
  formIds: IPreciseFormId[];
}

export interface ISectionWithMeta extends IPreciseFormSection {
  forms: IParticipantForm[];
}

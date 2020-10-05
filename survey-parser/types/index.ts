export interface IFormDef {
  xlsx: IFormDefWorksheets;
  specification: any;
}

// https://docs.odk-x.org/xlsx-converter-reference/#excel-worksheets
interface IFormDefWorksheets {
  // mandatory worksheets
  survey: ISurveyWorksheetRow[];
  settings: any;
  // optional worksheets
  properties?: any;
  calculates?: any;
  choices?: any;
  model?: any;
  queries?: any;
  column_types?: any;
  prompt_types?: any;
  framework_translations?: any;
  common_translations?: any;
  table_specific_translations?: any;
  // additional worksheets can be referenced by name
  [userDefinedSection: string]: ISurveyWorksheetRow[];
}

export interface ISurveyWorksheetRow {
  // populated metadata
  _row_num: number;
  // core inputs, compulsory on form but might be removed from formDef
  type?: string;
  name?: string;
  display?: {
    prompt?:
      | string
      | {
          text?: string;
          audio?: string;
          image?: string;
          video?: string;
        };
    title?: ITranslatableText;
    constraint_message?: ITranslatableText;
    hint?: ITranslatableText;
  };
  // additional inputs
  branch_label?: string;
  calculation?: string;
  choice_filter?: string;
  clause?: string;
  comments?: string;
  condition?: string;
  constraint?: string;
  default?: string;
  hideInContents?: string;
  inputAttributes?: {
    [attribute: string]: string;
  };
  isSessionVariable?: string;
  required?: string;
  templatePath?: string;
  value_list?: string;
  // not included in docs but still exists
  screen?: {
    screen_type?: string;
  };
}
type ISurveyRowKey = keyof ISurveyWorksheetRow;
// translations can be provided by a reference or direct text
type ITranslatableText = "string" | { text: string };

/**
 * Stats calculated when iterating through a section
 * @property answered  - shown to user, answered
 * @property skipped   - shown to user, not answered
 * @property missing   - shown to user, not answered, required
 */
export interface ISectionSummary {
  sectionName?: string;
  responses: { [fieldName: string]: any };
  skipped: { [fieldName: string]: "" };
  missing: { [fieldName: string]: "" };
}
export type ISectionSummaryGroup = keyof ISectionSummary;

/**
 * Additional stats calculated when looking at overall data structure
 * @property hidden  - shown to user, answered
 * @property invalid  - shown to user, answered
 */
interface ISurveySummary extends ISectionSummary {
  hidden: { [fieldname: string]: true };
  invalid: { [fieldname: string]: true };
}

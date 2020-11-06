import { IPreciseTableId } from "src/app/modules/precise/models";
import { IODkTableRowData } from "./odk.types";

export interface IProjectMeta {
  image: string;
  name: string;
  id: string;
  tables?: any[];
}
export interface IFormMeta {
  title: string;
  formId: string;
  tableId: string;
  icon?: string;
  // participant can fill multiple entries of same form
  allowRepeats?: boolean;
  mapFields?: IFormMetaMappedField[];
}
// Participant forms contain full form meta with specific participant entries
export interface IFormMetaWithEntries extends IFormMeta {
  entries: IODkTableRowData[];
}

export interface IFormMetaMappedField {
  table_id: IPreciseTableId;
  field_name: string;
  // used to assign a fixed value instead of lookup
  value?: any;
  // optional rename
  mapped_field_name?: string;
}

/**
 * Enforce strict type-checking for local environment variables
 */
export interface IEnvironment {
  SITE: "gambia" | "kenya";
  COUNTRY_CODE: "220" | "254";
  production: boolean;
  SENTRY_DSN: string;
  tableMapping: {
    [tableId in IPreciseTableId]?: string;
  };
  formMapping: {
    [formId in IPreciseTableId]?: string;
  };
}

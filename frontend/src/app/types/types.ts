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
}

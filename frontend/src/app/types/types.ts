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
  icon: string;
  // Note, entries populated dynamically for a specific participant
  entries: IODkTableRowData[];
}

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

export interface IFormMetaMappedField {
  table_id: string;
  field_name: string;
  // used to assign a fixed value instead of lookup
  value?: string;
  // optional rename
  mapped_field_name?: string;
}

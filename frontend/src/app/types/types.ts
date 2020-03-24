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
  disabled?: boolean;
  completed?: boolean;
}

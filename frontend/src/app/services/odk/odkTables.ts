class OdkTables {
  constructor() {}
  addRowWithSurvey(dispatchStruct, tableId, formId, screenPath?, jsonMap?) {
    alert(`[device only] - opening [${tableId}:${formId}]`);
  }
  editRowWithSurvey(dispatchStruct, tableId, rowId, formId, screenPath) {
    alert(`[device only] - edit [${tableId}:${formId}:${rowId}]`);
  }
}
export default OdkTables;

import { NotificationService } from "../notification/notification.service";

class OdkTables {
  constructor(private notifications: NotificationService) {}
  addRowWithSurvey(dispatchStruct, tableId, formId, screenPath?, jsonMap?) {
    return this.notifications.showMessage(
      `
      <div>Surveys will only show when running on Android device</div>
      <hr>
      <div class="font-size-smaller">Form: ${formId}</div>
      `
    );
  }
  editRowWithSurvey(dispatchStruct, tableId, rowId, formId, screenPath) {
    return this.notifications.showMessage(
      `
      <div>Surveys will only show when running on Android device</div>
      <hr>
      <div class="font-size-smaller">
        <div>Form: ${formId}</div>
        <div>Row:  ${rowId}</div>
      </div>
      `
    );
  }
}
export default OdkTables;

import { NotificationService } from "../../notification/notification.service";
import { MatDialog } from "@angular/material/dialog";
// import {
//   ODKFormPopup,
//   IODKFormFormPopupData,
// } from "src/app/modules/shared/components/odk/odkFormPopup/odkFormPopup";

class OdkTables {
  constructor(
    private notifications: NotificationService,
    private dialog: MatDialog
  ) {}
  /**
   * When running locally use the same method as ODK designer to display the designer-generated
   * form in an iframe
   * NOTE - deprecated since including Iframe
   */
  addRowWithSurvey(dispatchStruct, tableId, formId, screenPath?, jsonMap?) {
    // const iframeUrl = `http://localhost:8000/app/system/index.html?#formPath=..%2Fconfig%2Ftables%2F${tableId}%2Fforms%2F${formId}%2F&screenPath=initial%2F0`;
    // const data: IODKFormFormPopupData = { iframeUrl };
    // const dialogRef = this.dialog.open(ODKFormPopup, {
    //   data,
    //   panelClass: "odk-form-popup-panel",
    //   backdropClass: "odk-form-popup-backgroun",
    //   maxWidth: "100vw",
    //   maxHeight: "100vh",
    //   autoFocus: false,
    // });
    // return dialogRef.afterClosed().toPromise();
  }
  editRowWithSurvey(dispatchStruct, tableId, rowId, formId, screenPath) {
    // this.notifications.showMessage(
    //   `
    //   <div>Survey editing will only show when running on Android device</div>
    //   <hr>
    //   <div class="font-size-smaller">
    //     <div>Form: ${formId}</div>
    //     <div>Row:  ${rowId}</div>
    //   </div>
    //   `
    // );
  }
}
export default OdkTables;

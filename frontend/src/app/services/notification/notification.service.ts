import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import {
  NotificationBarComponent,
  ISnackbarData
} from "src/app/components/notificationBar";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  constructor(private snackbar: MatSnackBar) {}

  showMessage(message: string, data?: ISnackbarData) {
    return this.snackbar.openFromComponent(NotificationBarComponent, {
      data: { ...DATA_DEFAULTS, message, ...data }
    });
  }

  handleError(err: Error) {
    const message = err.message ? err.message : "Error Occured";
    return this.showMessage(message, { notificationType: "error", message });
  }
}

const DATA_DEFAULTS: ISnackbarData = {
  message: "",
  notificationType: "information"
};

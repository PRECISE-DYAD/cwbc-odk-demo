import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  NotificationBarComponent,
  ISnackbarData,
} from "src/app/components/common/notificationBar";
import { spy } from "mobx";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  storeEvents = [];
  constructor(private snackbar: MatSnackBar, private ngZone: NgZone) {
    // add state spy for use in error debugging
    // NOTE - disabled in prod https://github.com/mobxjs/mobx/issues/2201
    // possible alternates could be models or similar from
    // https://github.com/mobxjs/mobx-utils#deepobserve
    // TODO - should probably move to other error handler (e.g. sentry)
    spy((event) => {
      this.storeEvents.push(event);
    });
  }

  showMessage(message: string, data?: ISnackbarData) {
    this.ngZone.run(() => {
      this.snackbar.openFromComponent(NotificationBarComponent, {
        data: { ...DATA_DEFAULTS, message, ...data },
      });
    });
  }

  handleError(err: Error, additionalText: string = "") {
    console.error(err);
    let message =
      typeof err === "string"
        ? err
        : err.message
        ? err.message
        : "Error Occured";
    message = `${message}: ${additionalText}`;
    this.showMessage(message, { notificationType: "error", message });
  }
}

const DATA_DEFAULTS: ISnackbarData = {
  message: "",
  notificationType: "information",
};

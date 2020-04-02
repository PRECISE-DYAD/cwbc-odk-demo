import { Component, Inject } from "@angular/core";
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from "@angular/material/snack-bar";

@Component({
  selector: "app-notification-display-component",
  template: `
    <mat-card class="notification-main" [ngClass]="data.notificationType">
      <mat-icon style="margin-right:5px">{{ data.notificationType }}</mat-icon>
      <p class="notification-message">{{ data.message }}</p>
      <button class="notification-button" mat-button (click)="dismiss()">
        Dismiss
      </button>
    </mat-card>
  `,
  styles: [
    `
      .notification-main {
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        background: white;
        padding: 5px;
      }
      .notification-main.error {
        background: #ec3c3c;
        color: white;
      }
      .notification-main.information {
        background: #17a28b;
        color: white;
      }

      .notification-message {
        flex: 1;
        padding: 5px;
        margin-bottom: 0;
        width: 100%;
        white-space: normal;
        word-break: break-word;
      }
      .notification-button {
        margin: auto;
      }
    `
  ]
})
export class NotificationBarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<NotificationBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ISnackbarData
  ) {}
  dismiss() {
    return this.snackBarRef.dismiss();
  }
}

export interface ISnackbarData {
  message: string;
  notificationType: "error" | "information";
}

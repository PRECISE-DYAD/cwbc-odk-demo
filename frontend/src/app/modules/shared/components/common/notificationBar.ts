import { Component, Inject, ViewEncapsulation } from "@angular/core";
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from "@angular/material/snack-bar";

@Component({
  selector: "app-notification-display-component",
  // allow styles to be passed down directly
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-card class="notification-main" [ngClass]="data.notificationType">
      <mat-icon style="margin-right:5px">{{ data.notificationType }}</mat-icon>
      <div class="notification-message" [innerHtml]="data.message"></div>
      <button class="notification-button" mat-button (click)="dismiss()">
        Dismiss
      </button>
    </mat-card>
  `,
  styles: [
    `
      mat-card.notification-main {
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        padding: 5px;
      }
      mat-card.notification-main.error {
        background: #ec3c3c;
        color: white;
      }
      mat-card.notification-main.information {
        background: #17a28b;
        color: white;
      }

      .notification-message {
        flex: 1;
        padding: 5px;
        margin-bottom: 0;
        width: 100%;
        word-break: break-word;
      }
      .notification-button {
        margin: auto;
        margin-bottom: auto !important;
      }
      /* Directly passed by some messages */
      .font-size-smaller {
        font-size: smaller;
      }
    `,
  ],
})
export class NotificationBarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<NotificationBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ISnackbarData,
  ) {}
  dismiss() {
    this.snackBarRef.dismiss();
  }
}

export interface ISnackbarData {
  message: string;
  notificationType: "error" | "information";
}

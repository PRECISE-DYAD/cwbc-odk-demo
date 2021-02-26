import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IFormMetaWithEntries } from "src/app/modules/shared/types";

/**
 * Display a summary of a form's title alongside basic entry data, including whether it has been
 * any corresponding entries marked as completed or in progress
 */
@Component({
  selector: "app-form-entries-summary",
  template: `
    <div *ngFor="let entry of form.entries">
      <button mat-button (click)="entrySelected.next(entry._id)" [disabled]="form._disabled">
        <ng-container [ngSwitch]="entry._savepoint_type">
          <mat-icon *ngSwitchCase="'COMPLETE'"> check_box</mat-icon>
          <mat-icon *ngSwitchCase="'INCOMPLETE'">indeterminate_check_box</mat-icon>
          <mat-icon *ngSwitchDefault> check_box_outline_blank</mat-icon>
        </ng-container>
        <span>{{ title || form.title }}</span>
      </button>
      <div class="form-completion-date">
        <div>
          {{ entry._savepoint_timestamp | savepointTimestamp | date: "dd MMM yyyy, h:mm a" }}
        </div>
      </div>
      <button
        mat-button
        *ngIf="!form.allowRepeats && !form.entries[0]"
        (click)="entrySelected.next()"
        [disabled]="form._disabled"
      >
        <mat-icon>check_box_outline_blank</mat-icon>
        <span>{{ title || form.title }}</span>
      </button>
    </div>
    <button
      mat-button
      *ngIf="!form.allowRepeats && !form.entries[0]"
      (click)="entrySelected.next()"
      [disabled]="form._disabled"
    >
      <mat-icon>check_box_outline_blank</mat-icon>
      <span>{{ title || form.title }}</span>
    </button>
    <button
      mat-button
      *ngIf="form.allowRepeats"
      (click)="entrySelected.next()"
      [disabled]="form._disabled"
    >
      <mat-icon>add</mat-icon>
      <span>{{ title || form.title }}</span>
    </button>
    <div class="basic-warning" *ngIf="!form.allowRepeats && form.entries.length > 1">
      <mat-icon>warning</mat-icon>
      <span
        >Multiple entries detected. Please notify your supervisor or data manager to resolve.
      </span>
    </div>
    <div *ngIf="form._disabled_msg" style="margin-left: 50px; font-style:italic; margin-top: 0px;">
      <!-- <mat-icon svgIcon="forms_required"></mat-icon> -->
      <span>{{ form._disabled_msg }}</span>
    </div>
  `,
  styles: [
    `
      .form-completion-date {
        font-size: smaller;
        margin-left: 55px;
        margin-top: -8px;
      }

      :host {
        display: block;
      }
    `,
  ],
})
export class FormEntriesSummaryComponent {
  @Input() form: IFormMetaWithEntries;
  /** optional override of form title */
  @Input() title: string;
  @Output() entrySelected = new EventEmitter<string | undefined>();
}

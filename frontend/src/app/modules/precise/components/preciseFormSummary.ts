import { Component, Input } from "@angular/core";
import { PreciseStore } from "src/app/modules/precise/stores";
import { IODkTableRowData } from "src/app/modules/shared/types/odk.types";
import { IFormMetaWithEntries } from "src/app/modules/shared/types";

/**
 * Display a summary of a form's title alongside basic entry data, including whether it has been
 * any corresponding entries marked as completed or in progress
 */
@Component({
  selector: "precise-form-summary",
  template: `
    <div *ngFor="let entry of form.entries">
      <button mat-button (click)="openForm(form, entry)">
        <ng-container [ngSwitch]="entry._savepoint_type">
          <mat-icon *ngSwitchCase="'COMPLETE'"> check_box</mat-icon>
          <mat-icon *ngSwitchCase="'INCOMPLETE'"
            >indeterminate_check_box</mat-icon
          >
          <mat-icon *ngSwitchDefault> check_box_outline_blank</mat-icon>
        </ng-container>
        {{ form.title }}
      </button>
      <div class="form-completion-date">
        <div>
          {{
            entry._savepoint_timestamp
              | savepointTimestamp
              | date: "dd MMM yyyy, h:mm a"
          }}
        </div>
      </div>
      <button
        mat-button
        *ngIf="!form.allowRepeats && !form.entries[0]"
        (click)="openForm(form)"
      >
        <mat-icon>check_box_outline_blank</mat-icon>
        {{ form.title }}
      </button>
    </div>
    <button
      mat-button
      *ngIf="!form.allowRepeats && !form.entries[0]"
      (click)="openForm(form)"
    >
      <mat-icon>check_box_outline_blank</mat-icon>
      {{ form.title }}
    </button>
    <button mat-button *ngIf="form.allowRepeats" (click)="openForm(form)">
      <mat-icon>add</mat-icon>
      {{ form.title }}
    </button>
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
export class PreciseFormSummaryComponent {
  @Input() form: IFormMetaWithEntries;
  // Add sections for groups of forms, populating with data form stroe
  constructor(public store: PreciseStore) {}

  openForm(form: IFormMetaWithEntries, entry?: IODkTableRowData) {
    const editRowId = entry ? entry._id : null;
    this.store.launchForm(form, editRowId);
  }
}

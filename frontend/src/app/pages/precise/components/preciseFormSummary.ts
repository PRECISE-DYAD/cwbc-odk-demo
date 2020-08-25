import { Component, Input } from "@angular/core";
import { PreciseStore, IFormMetaWithEntries } from "src/app/stores";
import { IODkTableRowData } from "src/app/types/odk.types";

/**
 * Display a summary of a form's title alongside basic entry data, including whether it has been
 * any corresponding entries marked as completed or in progress
 */
@Component({
  selector: "precise-form-summary",
  template: `
    <div *ngFor="let entry of form.entries">
      <button mat-button (click)="openForm(form, entry)">
        <mat-icon *ngIf="entry._savepoint_type === 'COMPLETE'">
          check_box</mat-icon
        >
        <mat-icon *ngIf="entry._savepoint_type === 'INCOMPLETE'"
          >indeterminate_check_box</mat-icon
        >
        {{ form.title }}
      </button>
      <div class="form-completion-date">
        {{ entry._savepoint_timestamp | savepointTimestamp | date }}
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
    <button mat-button *ngIf="form.allowRepeats" (click)="openForm(form)">
      <mat-icon>add</mat-icon>
      {{ form.title }}
    </button>
  `,
  styles: [
    `
      .form-completion-date {
        font-size: smaller;
        margin-left: 44px;
        margin-top: -5px;
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

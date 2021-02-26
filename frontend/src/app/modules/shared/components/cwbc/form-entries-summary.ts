import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IFormMetaWithEntries } from "src/app/modules/shared/types";

/**
 * Display a summary of a form's title alongside basic entry data, including whether it has been
 * any corresponding entries marked as completed or in progress
 */
@Component({
  selector: "app-form-entries-summary",
  template: `
    <!-- Existing entries -->
    <div *ngFor="let entry of form.entries">
      <button mat-button (click)="entrySelected.next(entry._id)" [disabled]="form._disabled">
        <!-- The _savepoint_type (metadata) column === "COMPLETE" if they are 'official' values.
         Otherwise, _savepoint_type === "INCOMPLETE" indicates a manual user savepoint and
          _savepoint_type IS NULL indicates an automatic (checkpoint) savepoint. -->
        <ng-container [ngSwitch]="entry._savepoint_type">
          <mat-icon *ngSwitchCase="'COMPLETE'"> check_box</mat-icon>
          <mat-icon *ngSwitchCase="'INCOMPLETE'">indeterminate_check_box</mat-icon>
          <mat-icon *ngSwitchDefault>update</mat-icon>
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
      <div *ngIf="!entry._savepoint_type" style="">
        <div class="inline-warning">
          <span
            >This entry has unsaved changes. Please re-open and either finalize, save or ignore the
            changes</span
          >
        </div>
      </div>
    </div>
    <!-- First entry -->
    <button
      mat-button
      *ngIf="!form.allowRepeats && !form.entries[0]"
      (click)="entrySelected.next()"
      [disabled]="form._disabled"
    >
      <mat-icon>check_box_outline_blank</mat-icon>
      <span>{{ title || form.title }}</span>
    </button>
    <!-- Repeat entries -->
    <button
      mat-button
      *ngIf="form.allowRepeats"
      (click)="entrySelected.next()"
      [disabled]="form._disabled"
    >
      <mat-icon>add</mat-icon>
      <span>{{ title || form.title }}</span>
    </button>
    <!-- Warnings and Messages -->
    <div class="basic-warning" *ngIf="showMultipleEntryWarning">
      <mat-icon>warning</mat-icon>
      <span
        >Multiple entries detected. Please notify your supervisor or data manager to resolve.
      </span>
    </div>
    <div *ngIf="form._disabled_msg" class="inline-warning">
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
export class FormEntriesSummaryComponent implements OnInit {
  @Input() form: IFormMetaWithEntries;
  /** optional override of form title */
  @Input() title: string;
  @Output() entrySelected = new EventEmitter<string | undefined>();
  showMultipleEntryWarning = false;

  ngOnInit() {
    // show multiple entries warning if multiple entries exist with savepoints (null value is automatic checkpoint, handled elsewhere)
    const savedEntries = this.form.entries.filter((entry) => entry._savepoint_type);
    this.showMultipleEntryWarning = !this.form.allowRepeats && savedEntries.length > 1;
  }
}

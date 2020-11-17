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
      <button mat-button (click)="entrySelected.next(entry._id)">
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
        (click)="entrySelected.next()"
      >
        <mat-icon>check_box_outline_blank</mat-icon>
        {{ form.title }}
      </button>
    </div>
    <button
      mat-button
      *ngIf="!form.allowRepeats && !form.entries[0]"
      (click)="entrySelected.next()"
    >
      <mat-icon>check_box_outline_blank</mat-icon>
      {{ form.title }}
    </button>
    <button mat-button *ngIf="form.allowRepeats" (click)="entrySelected.next()">
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
export class FormEntriesSummaryComponent {
  @Input() form: IFormMetaWithEntries;
  @Output() entrySelected = new EventEmitter<string | undefined>();
}

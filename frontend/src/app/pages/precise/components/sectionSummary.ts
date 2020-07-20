import { Component, Input } from "@angular/core";
import { PreciseStore, IParticipantForm } from "src/app/stores";
import { IODkTableRowData } from "src/app/types/odk.types";
import { ISectionWithMeta } from "src/app/models/precise.models";

@Component({
  selector: "precise-section-summary",
  template: `
    <section class="section-details">
      <div *ngFor="let form of section.forms">
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
            {{ entry._savepoint_timestamp | date }}
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
      </div>
    </section>
  `,
  styles: [
    `
      section {
        transition: all 0.2s ease-in-out;
        background: white;
      }
      section.disabled {
        transform: none;
        pointer-events: none;
        opacity: 0.5;
      }

      .section-details {
        color: var(--color-black);
        padding: 5px 0;
        width: 100%;
      }
      .section-details button {
        width: 100%;
        text-align: left;
      }
      .form-completion-date {
        font-size: smaller;
        margin-left: 44px;
        margin-top: -5px;
      }
    `,
  ],
})
export class PreciseSectionSummaryComponent {
  @Input() section: ISectionWithMeta;
  // Add sections for groups of forms, populating with data form stroe
  constructor(public store: PreciseStore) {}

  openForm(form: IParticipantForm, entry?: IODkTableRowData) {
    const editRowId = entry ? entry._id : null;
    this.store.launchForm(form, editRowId);
  }
}

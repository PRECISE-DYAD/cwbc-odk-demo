import { Component } from "@angular/core";
import {
  PRECISE_FORM_SECTIONS,
  PreciseStore,
  IPreciseFormSection,
  IParticipantForm,
  PRECISE_BABY_FORM_SECTIONS,
} from "src/app/stores";
import { toJS } from "mobx";
import { IODkTableRowData } from "src/app/types/odk.types";

@Component({
  selector: "precise-sections-summary",
  template: ` <div id="section-summary-container">
    <section
      *ngFor="let section of sections; let i = index"
      [class]="'section-tile color-rotate-' + i"
    >
      <header class="primary-inverted">
        <mat-icon class="section-icon" [svgIcon]="section.icon"></mat-icon>
        <span>{{ section.label }}</span>
      </header>
      <div class="section-details">
        <div *ngFor="let form of section.forms">
          <div *ngFor="let entry of form.entries">
            <button mat-button (click)="openForm(form, entry)">
              <mat-icon *ngIf="entry._savepoint_type === 'COMPLETE'">
                check_box</mat-icon
              >
              <mat-icon *ngIf="entry._savepoint_type === 'INCOMPLETE'"
                >indeterminate_check_box</mat-icon
              >
              <!-- TODO show different icon if incomplete -->
              {{ entry._savepoint_timestamp | date }}
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
        </div>
        <!-- No Data Recorded -->
      </div>
    </section>
  </div>`,
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
      header {
        padding: 8px;
        display: flex;
        align-items: center;
      }
      header > .section-icon {
        margin-right: 10px;
      }
      #section-summary-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        grid-column-gap: 10px;
        grid-row-gap: 10px;
      }
      .section-tile {
        min-height: 100px;
        border: 4px solid;
        border-radius: 8px;
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
    `,
  ],
})
export class PreciseSectionsSummary {
  sections: ISectionWithMeta[];
  gridCols = Math.ceil(window.innerWidth / 400);
  constructor(public store: PreciseStore) {
    this.sections = PRECISE_FORM_SECTIONS.map((s) => ({
      ...s,
      forms: s.formIds.map((formId) =>
        toJS(store.participantFormsHash[formId])
      ),
    }));
    console.log("sections", this.sections);
  }

  openForm(form: IParticipantForm, entry?: IODkTableRowData) {
    const { tableId, formId } = form;
    const editRowId = entry ? entry._id : null;
    this.store.launchForm(tableId, formId, editRowId);
  }

  getParticipantForms() {}

  /**
   * Baby forms need to be dynamically populated in case of multiple births
   * (repetition required)
   * TODO - handle populating the potentially multiple values and render methods
   */
  getBabyForms(total: number = 1) {
    return new Array(total)
      .fill(PRECISE_BABY_FORM_SECTIONS)
      .map((f, i) => ({ ...f, label: `Baby ${i + 1}` }));
  }
}

interface ISectionWithMeta extends IPreciseFormSection {
  forms: IParticipantForm[];
}

import { Component } from "@angular/core";
import {
  PRECISE_FORM_SECTIONS,
  PreciseStore,
  IPreciseFormSection,
  IParticipantForm,
} from "src/app/stores";
import { toJS } from "mobx";
import { IODkTableRowData } from "src/app/types/odk.types";

@Component({
  selector: "precise-sections-summary",
  template: ` <mat-grid-list
    rowHeight="150px"
    [cols]="gridCols"
    gutterSize="20px"
  >
    <mat-grid-tile
      *ngFor="let section of sections; let i = index"
      colspan="1"
      rowspan="1"
      [class]="'section-tile color-rotate-' + i"
    >
      <mat-grid-tile-header class="primary-inverted">
        <mat-icon class="section-icon" [svgIcon]="section.icon"></mat-icon>
        <span>{{ section.label }}</span></mat-grid-tile-header
      >
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
    </mat-grid-tile>
  </mat-grid-list>`,
  styles: [
    `
      mat-grid-tile {
        transition: all 0.2s ease-in-out;
        background: white;
        border: 4px solid;
        border-radius: 8px;
      }
      mat-grid-tile.disabled {
        transform: none;
        pointer-events: none;
        opacity: 0.5;
      }
      mat-grid-tile-header > .section-icon {
        margin-right: 10px;
      }
      .section-details {
        color: var(--color-black);
        position: absolute;
        top: 48px;
        height: 100px;
        overflow: auto;
        left: 0;
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
}

interface ISectionWithMeta extends IPreciseFormSection {
  forms: IParticipantForm[];
}

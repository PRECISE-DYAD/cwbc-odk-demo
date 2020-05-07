import { Component } from "@angular/core";
import {
  PRECISE_FORM_SECTIONS,
  PRECISE_BABY_FORM_SECTION,
  PreciseStore,
  IPreciseFormSection,
  IParticipantForm,
} from "src/app/stores";
import { toJS } from "mobx";
import { IODkTableRowData } from "src/app/types/odk.types";

@Component({
  selector: "precise-sections-summary",
  template: ` <div id="section-summary-container">
    <section
      *ngFor="let section of sections; let i = index"
      [class]="'section-tile color-rotate-' + i"
      [attr.data-section]="section.label"
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
      </div>
    </section>
    <section
      class="section-tile"
      id="addBabySection"
      (click)="store.addParticipantBaby()"
    >
      <mat-icon>add</mat-icon>
      <span>Record Baby</span>
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
      #addBabySection {
        border: 2px dashed;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 1;
        background: #f3f3f3;
        color: #8c8c8c;
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
      .form-completion-date {
        font-size: smaller;
        margin-left: 44px;
        margin-top: -5px;
      }
    `,
  ],
})
export class PreciseSectionsSummary {
  sections: ISectionWithMeta[];
  gridCols = Math.ceil(window.innerWidth / 400);
  // Add sections for groups of forms, populating with data form stroe
  constructor(public store: PreciseStore) {
    this.sections = PRECISE_FORM_SECTIONS.map((s) => ({
      ...s,
      forms: s.formIds.map((formId) => this.getFormWithEntries(formId)),
    }));
    // Add sections for each recorded birth
    store.participantFormsHash.Birthbaby.entries.forEach((row) => {
      this._addBabySection(row.f2_guid_child);
    });
    console.log("sections", this.sections);
  }

  /**
   * Given a formId return full form meta with entries
   */
  getFormWithEntries(formId: string): IParticipantForm {
    return toJS(this.store.participantFormsHash[formId]);
  }

  /**
   * Dynamically populate baby forms
   */
  private _addBabySection(f2_guid_child: string) {
    // default, push section to end
    const s: IPreciseFormSection = {
      ...PRECISE_BABY_FORM_SECTION,
      label: `Baby ${f2_guid_child.split("_").pop()}`,
    };
    let forms = s.formIds.map((formId) => this.getFormWithEntries(formId));
    forms = forms.map((f) => {
      // take all form entries and assign only those with matching baby guid
      const entries = f.entries.filter(
        (row) => row.f2_guid_child == f2_guid_child
      );
      return { ...f, entries };
    });
    this.sections.push({ ...s, forms });
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

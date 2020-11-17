import { Component, Input, OnInit } from "@angular/core";
import { ISectionWithMeta } from "src/app/modules/precise/models";
import {
  PRECISE_BABY_SUMMARY_FIELDS,
  IPreciseParticipantData,
} from "src/app/modules/precise/models/participant-summary.model";
import { PreciseStore } from "../../../stores";

@Component({
  selector: "precise-profile-baby-section",
  template: `
    <section class="section-details">
      <app-form-entries-summary
        *ngFor="let form of section.forms"
        [form]="form"
        (entrySelected)="store.launchForm(form, $event)"
      ></app-form-entries-summary>
      <!-- HACK - only show summary table if data collected for first (birthbaby) form. Could be linked better -->
      <table
        style="background:none; margin:1em;"
        *ngIf="section.forms[0].entries[0]"
      >
        <tr *ngFor="let summary of summaryFields">
          <td class="field-label">{{ summary.label }}</td>
          <td class="field-value">
            <app-field-summary
              [summary]="summary"
              [data]="summaryData"
            ></app-field-summary>
          </td>
        </tr>
      </table>
      <div style="padding:1em; display:flex; align-items:center">
        <mat-icon>help_outline</mat-icon>
        <span style="margin-left:5px"
          >To record additional births specify the total number of babies born
          in the <strong>Birth Mother</strong> form</span
        >
      </div>
    </section>
  `,
  styleUrls: ["../precise-profile.component.scss"],
})
export class PreciseProfileBabySectionComponent implements OnInit {
  summaryFields = PRECISE_BABY_SUMMARY_FIELDS;
  summaryData: IPreciseParticipantData;
  @Input() section: ISectionWithMeta;
  constructor(public store: PreciseStore) {}

  ngOnInit() {
    // Refactor specific baby data to pass to summary-field component and override participant data
    const summaryData: any = {};
    this.section.forms.forEach((v) => {
      summaryData[v.tableId] = v.entries[0] || {};
    });
    this.summaryData = summaryData;
  }
}

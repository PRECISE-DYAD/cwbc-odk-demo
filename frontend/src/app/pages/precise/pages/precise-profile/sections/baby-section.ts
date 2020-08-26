import { Component, Input, OnInit, ɵConsole } from "@angular/core";
import { ISectionWithMeta } from "src/app/models/precise.models";
import {
  PRECISE_BABY_SUMMARY_FIELDS,
  IPreciseParticipantData,
} from "src/app/models/participant-summary.model";

@Component({
  selector: "precise-profile-baby-section",
  template: `
    <section class="section-details">
      <precise-form-summary
        *ngFor="let form of section.forms"
        [form]="form"
      ></precise-form-summary>
      <!-- HACK - only show summary table if data collected for first (birthbaby) form. Could be linked better -->
      <table
        style="background:none; margin:1em;"
        *ngIf="section.forms[0].entries[0]"
      >
        <tr *ngFor="let summary of summaryFields">
          <td class="field-label">{{ summary.label }}</td>
          <td class="field-value">
            <precise-field-summary
              [summary]="summary"
              [data]="summaryData"
            ></precise-field-summary>
          </td>
        </tr>
      </table>
    </section>
  `,
  styleUrls: ["../precise-profile.component.scss"],
})
export class PreciseProfileBabySectionComponent implements OnInit {
  summaryFields = PRECISE_BABY_SUMMARY_FIELDS;
  summaryData: IPreciseParticipantData;
  @Input() section: ISectionWithMeta;

  ngOnInit() {
    // Refactor specific baby data to pass to summary-field component and override participant data
    const summaryData = {};
    this.section.forms.forEach((v) => {
      summaryData[v.tableId] = v.entries[0] || {};
    });
    this.summaryData = summaryData;
  }
}

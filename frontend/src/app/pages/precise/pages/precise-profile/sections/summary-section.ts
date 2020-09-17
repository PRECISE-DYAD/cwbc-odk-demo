import { Component } from "@angular/core";
import { PRECISE_SUMMARY_FIELDS } from "src/app/models/participant-summary.model";

@Component({
  selector: "precise-profile-summary-section",
  template: `<table style="margin-bottom:1em">
    <tr *ngFor="let summary of fieldSummaries">
      <td class="field-label" [innerHTML]="summary.label"></td>
      <td class="field-value">
        <precise-field-summary [summary]="summary"></precise-field-summary>
      </td>
    </tr>
  </table>`,
  styleUrls: ["../precise-profile.component.scss"],
})
export class PreciseProfileSummarySectionComponent {
  fieldSummaries = PRECISE_SUMMARY_FIELDS;
}

import { Component, Input } from "@angular/core";
import { IDyadMappedField } from "src/app/modules/dyad/models/dyad.models";
import {
  IPreciseFieldSummary,
  IPreciseParticipantData,
} from "src/app/modules/precise/models/participant-summary.model";

@Component({
  selector: "app-field-summary-table",
  template: `<table style="margin-bottom:1em">
    <tr *ngFor="let summary of summaries">
      <td class="field-label" [innerHTML]="summary.label"></td>
      <td class="field-value">
        <app-field-summary [summary]="summary" [data]="participantData"></app-field-summary>
      </td>
    </tr>
  </table>`,
  styles: [
    `
      table {
        background: rgba(255, 255, 255, 0.6);
        width: calc(100% - 2em);
        max-width: 500px;
        margin: 0 1em;
      }
      td.field-label {
        width: 250px;
      }
      td {
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding: 5px;
      }
      :host {
        display: block;
      }
    `,
  ],
})
export class FieldSummaryTableComponent {
  summaries: IPreciseFieldSummary[] = [];
  @Input() set fieldSummaries(fieldSummaries: (IPreciseFieldSummary | IDyadMappedField)[]) {
    // TODO - slightly different handling for precise and dyad cna hopefully be merged in the future
    this.summaries = (fieldSummaries || [])
      .map((s) => ({
        ...(s as IPreciseFieldSummary),
        label: (s as IPreciseFieldSummary).label || (s as IDyadMappedField).summary_label,
      }))
      .filter((s) => s.label);
  }
  @Input() participantData: IPreciseParticipantData;
}

import { Component, Input } from "@angular/core";
import {
  IPreciseFieldSummary,
  IPreciseParticipantData,
} from "src/app/modules/precise/models/participant-summary.model";

@Component({
  selector: "app-field-summary-table",
  template: `<table style="margin-bottom:1em">
    <tr *ngFor="let summary of fieldSummaries">
      <td class="field-label" [innerHTML]="summary.label"></td>
      <td class="field-value">
        <app-field-summary
          [summary]="summary"
          [data]="participantData"
        ></app-field-summary>
      </td>
    </tr>
  </table>`,
  styles: [
    `
      table {
        background: white;
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
    `,
  ],
})
export class FieldSummaryTableComponent {
  @Input() fieldSummaries: IPreciseFieldSummary[];
  @Input() participantData: IPreciseParticipantData;
}

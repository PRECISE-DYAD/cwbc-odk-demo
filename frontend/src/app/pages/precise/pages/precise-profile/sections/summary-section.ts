import { Component, OnInit } from "@angular/core";
import { PreciseStore } from "src/app/stores";
import {
  PRECISE_SUMMARY_FIELDS,
  PRECISE_SUMMARY_FIELD_CALCS,
  IPreciseFieldSummary,
  IPreciseParticipantData,
} from "src/app/models/participant-summary.model";

@Component({
  selector: "precise-profile-summary-section",
  template: `<table>
    <tr *ngFor="let s of fieldSummaries">
      <td>{{ s.label }}</td>
      <td>{{ s.value }}</td>
    </tr>
  </table>`,
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;
        max-width: 400px;
        margin: 0 1em 1em 1em;
      }
      td {
        border: 1px solid black;
        padding: 5px;
      }
    `,
  ],
})
export class PreciseProfileSummarySectionComponent implements OnInit {
  // TODO - include icons and transformations, and refactor to own component
  fieldSummaries: IPreciseFieldSummaryWithMeta[] = [];
  constructor(private store: PreciseStore) {}

  ngOnInit(): void {
    const data = { ...this.store.activeParticipantData };
    const _calcs = PRECISE_SUMMARY_FIELD_CALCS(data);
    this.fieldSummaries = this.calculateFieldSummaries(PRECISE_SUMMARY_FIELDS, {
      ...data,
      _calcs,
    });
  }

  calculateFieldSummaries(
    summaries: IPreciseFieldSummary[],
    data: IPreciseParticipantData
  ): IPreciseFieldSummaryWithMeta[] {
    return summaries.map((s) => {
      if (s.calculation) {
        try {
          s.value = this._parseExpression(data, s.calculation);
        } catch (error) {
          console.error("could not evaluate", s.calculation, error);
          s.value = undefined;
        }
      }
      const _hasValue = [undefined, ""].includes(s.value);
      return { ...s, _hasValue };
    });
  }

  _getParticipantValue(table: string, field: string) {
    const { participantFormsHash } = this.store;
    let value: string;
    if (participantFormsHash && participantFormsHash[table]) {
      const entries = [...participantFormsHash[table]];
      value = entries[entries.length - 1][field];
    }
    return value;
  }
  /**
   * Create a dynamic function to parse the calculation expression without
   * the nees for `eval()` operator
   */
  _parseExpression(data: any = {}, str: string) {
    const args = "data, str";
    const body = `'use strict'; return (${str})`;
    return new Function(args, body).apply(null, [data, str]);
  }
}
type IPreciseFieldSummaryWithMeta = IPreciseFieldSummary & {
  _hasValue: boolean;
};

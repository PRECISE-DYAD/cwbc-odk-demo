import { Component, Input, ViewEncapsulation } from "@angular/core";
import {
  IPreciseFieldSummary,
  IPreciseParticipantData,
} from "src/app/modules/precise/models/participant-summary.model";

@Component({
  selector: "app-field-summary",
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container>
      {{ value }}
    </ng-container>
  `,
  styles: [
    `
      :host: {
        display: contents;
      }
    `,
  ],
})
/**
 * Reworking of precise-field-summary to make more generic
 * Takes a summary calculation object and relevant participant data
 * to calculate a value for the given summary
 */
export class FieldSummaryComponent {
  @Input() summary: IPreciseFieldSummary;
  // optional override of data (e.g. use baby data instead of participant data)
  @Input() set data(data: IPreciseParticipantData) {
    this.calculateFieldSummary(this.summary, data);
  }
  value = "";

  private calculateFieldSummary(
    summary: IPreciseFieldSummary,
    data: IPreciseParticipantData
  ) {
    let value: any;
    const { tableId, field, calculation } = summary;
    // direct lookup
    if (tableId && field) {
      value = data[tableId][field];
    }
    // calculation
    if (calculation) {
      try {
        if (typeof calculation === "string") {
          value = this._parseExpression(data, calculation);
        } else {
          value = calculation(data);
        }
      } catch (error) {
        console.warn("could not evaluate", calculation, error, data);
        value = undefined;
      }
    }
    this.value = value;
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

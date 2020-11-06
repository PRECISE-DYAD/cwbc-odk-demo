import { Component, Input, ViewEncapsulation } from "@angular/core";
import {
  IPreciseFieldSummary,
  IPreciseParticipantData,
} from "src/app/modules/precise/models/participant-summary.model";
import { PreciseStore } from "src/app/modules/precise/stores";

@Component({
  selector: "precise-field-summary",
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *ngIf="store.activeParticipantData">
      {{ value }}
    </ng-container>
    <ng-container *mobxReaction="participantUpdated.bind(this)"></ng-container>
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
 *  Extracts or calculate values used in summaries as defined by a summary object
 *  Binds to the store to ensure calculations are being carried out on updated data
 */
export class PreciseFieldSummaryComponent {
  _data;
  @Input() summary: IPreciseFieldSummary;
  // optional override of data (e.g. use baby data instead of participant data)
  @Input() set data(data: IPreciseParticipantData) {
    this._data = data;
    this.calculateFieldSummary(this.summary, data);
  }

  // TODO - include icons and transformations
  value = "";
  _hasValue = false;

  constructor(public store: PreciseStore) {}

  public participantUpdated() {
    // ignore reaction if override data supplied
    if (!this._data) {
      if (this.store.activeParticipantData) {
        this.calculateFieldSummary(
          this.summary,
          this.store.activeParticipantData
        );
      } else {
        this.value = "";
        this._hasValue = false;
      }
    }
  }

  private calculateFieldSummary(
    summary: IPreciseFieldSummary,
    data: IPreciseParticipantData
  ) {
    let value: any;
    const { tableId, field, calculation } = summary;
    if (tableId && field) {
      value = data[tableId][field];
    }
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
    this._hasValue = ![undefined, ""].includes(value);
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

import { Component, OnInit } from "@angular/core";
import { PreciseStore } from "src/app/stores";
import { PRECISE_SUMMARY_FIELDS } from "src/app/models/precise.models";

@Component({
  selector: "precise-table-summary",
  templateUrl: "./table-summary.component.html",
  styleUrls: ["./table-summary.component.scss"],
})
export class PreciseTableSummaryComponent implements OnInit {
  constructor(private store: PreciseStore) {}

  ngOnInit(): void {
    this.generateFieldSummary();
  }

  generateFieldSummary() {
    console.log("generating summary", this.store.activeParticipant);
    const summary = [];
    for (const s of PRECISE_SUMMARY_FIELDS) {
      const { field, label, table } = s;
      summary.push({
        label,
        data: this._getParticipantValue(table, field),
      });
    }
    console.log("summary", summary);
  }

  generateCalculatedSummary() {
    const fields = [];
    const data = this.store.participantFormsHash;
    const today = new Date();
    fields.push({
      label: "Number of weeks between PRECISE Visit 1 and Today",
      value: today.getTime() - data.Visit1.entries[0],
    });
    // {
    //   table:null,
    //   calc: "today()-data.Visit1.",
    //   label:
    // }
  }

  _extractVariablesForCalc() {
    const today = new Date()
    const visit1Date = this._getParticipantValue('Visit1','')
    // const weeksSinceVisit1 = today.getTime() - new Date()
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
}

/**
 * Gestational age at today
Number of weeks between PRECISE Visit 1 and Today
Date of PRECISE Visit 1
Gestational age at PRECISE Visit 1
Minimum PRECISE Visit 2 Date (28 weeks GA)
Date of PRECISE Visit 2
Gestational age at PRECISE Visit 2
Number of weeks from PRECISE Visit 1 to Visit 2
Gestational age at Birth Visit
Delivery Date
Gestational age at Delivery
Number of babies
Lost to follow-up or withdrawal
 */

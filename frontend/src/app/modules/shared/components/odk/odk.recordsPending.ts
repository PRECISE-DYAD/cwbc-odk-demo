import { Component, OnInit } from "@angular/core";
import { OdkService } from "src/app/services/odk/odk.service";

@Component({
  selector: "odk-records-pending",
  styles: [
    `
      :host {
        display: block;
      }
      .last-sync-text {
        position: absolute;
        width: 100%;
        top: 22px;
        opacity: 0.5;
      }
    `,
  ],
  template: `
    <div
      style="display:flex; align-items:center;"
      *ngIf="recordsPending != undefined"
    >
      <mat-icon style="margin-right:8px">cloud_upload</mat-icon>
      <span style="margin-right:4px">{{ recordsPending }}</span>
      <span *ngIf="recordsPending === 1">record</span>
      <span *ngIf="recordsPending !== 1">records</span>
    </div>
  `,
})
export class ODKRecordsPendingComponent implements OnInit {
  recordsPending: number;
  constructor(public odkService: OdkService) {}

  ngOnInit() {
    this.odkService.getRecordsToSync().then((v) => (this.recordsPending = v));
  }
}

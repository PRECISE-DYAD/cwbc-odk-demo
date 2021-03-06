import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PreciseStore } from "src/app/modules/precise/stores";
import { environment } from "src/environments/environment";
import { IParticipant, IParticipantScreening } from "../types";

@Component({
  selector: "app-enrollment-dialog",
  styles: [],
  template: `
    <h2 mat-dialog-title>Enrol Participant</h2>
    <mat-dialog-content>
      <p>What is the PTID for the participant you wish to enrol?</p>

      <mat-form-field color="primary">
        <input
          matInput
          type="text"
          ngModel
          #ptid="ngModel"
          [placeholder]="'e.g. ' + COUNTRY_CODE + '-xxxxx'"
          cdkFocusInitial
          [pattern]="validationPattern"
          required
          (keyup)="screeningRecords = null; existingParticipant = null"
        />
      </mat-form-field>
      <div style="height:2em" style="color:#f44336">
        <span *ngIf="ptid.invalid && ptid.touched"
          >Please enter PTID in correct format: {{ COUNTRY_CODE }}-XXXXX</span
        >
      </div>
      <div style="height:2em" *ngIf="!existingParticipant">
        <span *ngIf="screeningRecords"
          ><strong>{{ screeningRecords.length }}</strong> Screening Records
          Found</span
        >
      </div>
      <div style="height:2em" *ngIf="existingParticipant">
        <span>Participant already enrolled</span>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close({ action: 'cancel' })">
        Cancel
      </button>
      <button
        style="flex:1"
        mat-stroked-button
        [disabled]="!ptid.valid || disableButtons"
        (click)="verifyScreening(ptid.value)"
        *ngIf="!screeningRecords"
      >
        Verify PTID
      </button>
      <button
        style="flex:1"
        mat-raised-button
        color="accent"
        (click)="dialogRef.close({ action: 'addScreening', data: ptid.value })"
        *ngIf="screeningRecords && screeningRecords.length == 0"
      >
        Screen
      </button>
      <button
        style="flex:1"
        mat-raised-button
        color="primary"
        *ngIf="screeningRecords && !existingParticipant"
        (click)="
          dialogRef.close({
            action: 'enrol',
            data: { f2a_participant_id: ptid.value }
          })
        "
      >
        Enrol
      </button>
      <button
        style="flex:1"
        mat-raised-button
        color="primary"
        *ngIf="existingParticipant"
        (click)="
          dialogRef.close({ action: 'viewExisting', data: existingParticipant })
        "
      >
        View Participant
      </button>
    </mat-dialog-actions>
  `,
})
export class EnrollmentDialogComponent {
  COUNTRY_CODE = environment.COUNTRY_CODE;
  validationPattern = `${this.COUNTRY_CODE}-\\d{5}`;
  disableButtons = false;
  screeningRecords: IParticipantScreening[];
  existingParticipant: IParticipant;
  constructor(
    public dialogRef: MatDialogRef<EnrollmentDialogComponent>,
    public store: PreciseStore
  ) {}

  verifyScreening(ptid: string) {
    this.disableButtons = true;
    this.screeningRecords = undefined;
    this.existingParticipant = null;
    // use timeout to give better impression of searching
    setTimeout(() => {
      this.screeningRecords = this.store.screeningData.filter(
        (d) =>
          d.f0_woman_precise_id === ptid ||
          d.f1_woman_precise_id === ptid ||
          d.f0_precise_id === ptid
      );

      const participantRecords = this.store.allParticipants.filter(
        (p) => p.f2a_participant_id === ptid
      );
      this.existingParticipant =
        participantRecords.length > 0 ? participantRecords[0] : null;
      this.disableButtons = false;
    }, 1000);
  }
}

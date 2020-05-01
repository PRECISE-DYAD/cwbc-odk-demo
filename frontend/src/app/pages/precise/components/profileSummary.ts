import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IParticipant } from "src/app/stores";
import * as Animations from "src/app/animations";

@Component({
  selector: "precise-profile-summary",
  template: `
    <div class="summary-container">
      <h2 class="summary-title">Summary</h2>
      <div class="summary-action-buttons">
        <button
          mat-button
          [style.visibility]="
            participantRevisions.length > 1 ? 'visible' : 'hidden'
          "
          (click)="showRevisions()"
        >
          <mat-icon class="field-icon">history</mat-icon>
          {{ participantRevisions.length - 1 }} Revisions
        </button>
      </div>
      <table>
        <th *ngFor="let heading of tableHeadings"></th>
        <tr class="table-row" *ngFor="let f of fieldMappings">
          <td>
            <mat-icon class="field-icon">{{ f.icon }}</mat-icon>
          </td>
          <td class="field-label">{{ f.label }}</td>
          <td class="field-value">{{ participant[f.field] }}</td>
        </tr>
      </table>
    </div>
    <!-- Confirmation -->
    <div
      class="confirmation-container"
      @fadeEntryExit
      *ngIf="!profileConfirmed"
    >
      <div style="margin:1em 0">
        Is the information above
        <strong>accurate and up-to-date?</strong>
      </div>
      <div style="display:flex; flex-wrap:wrap">
        <button mat-button mat-raised-button (click)="shouldUpdate.emit(true)">
          <mat-icon style="margin-right:5px">edit</mat-icon>
          <span>No, update</span>
        </button>
        <button mat-button mat-raised-button (click)="shouldUpdate.emit(false)">
          <mat-icon style="margin-right:5px">check</mat-icon>
          <span>Yes, accurate</span>
        </button>
      </div>
    </div>
  `,
  animations: [Animations.fadeEntryExit],
  styles: [
    `
      .summary-container,
      .confirmation-container {
        margin: auto;
        max-width: 300px;
        color: var(--color-black);
      }
      .summary-container {
        border: 2px solid var(--color-black);
        border-radius: 8px;
        padding-bottom: 5px;
      }
      .summary-title {
        color: white;
        margin: 0;
        text-align: center;
        background: var(--color-black);
      }
      .summary-action-buttons {
        display: flex;
        justify-content: space-between;
      }
      table {
        padding: 10px;
        background: white;
        width: 100%;
      }
      td {
        padding: 5px;
      }
      .table-row {
        padding: 5px;
        border-bottom: 1px solid black;
      }
      .field-icon {
        color: var(--color-black);
      }
      .field-value {
        opacity: 0.9;
      }
      .field-label {
        font-weight: bold;
      }
      .confirmation-container button {
        flex: 1;
        margin: 2px;
        padding: 5px;
      }
    `,
  ],
})
export class PreciseProfileSummary {
  @Input() participant: IParticipant;
  @Input() participantRevisions: IParticipant[];
  @Input() profileConfirmed: boolean;
  @Output() shouldUpdate = new EventEmitter<boolean>();

  showRevisions() {
    // TODO - build review methods
    alert(`Revision history not currently available (under development)`);
  }

  tableHeadings = ["Icon", "Field", "Value"];
  fieldMappings = [
    {
      field: "f2a_national_id",
      label: "National ID",
      icon: "folder_shared",
    },
    {
      field: "f2a_full_name",
      label: "Name",
      icon: "person",
    },
    {
      field: "f2a_phone_number",
      label: "Phone 1",
      icon: "phone",
    },
    {
      field: "f2a_phone_number_2",
      label: "Phone 2",
      icon: "phone",
    },
    {
      field: "f2_woman_addr",
      label: "Address",
      icon: "home",
    },
  ];
}

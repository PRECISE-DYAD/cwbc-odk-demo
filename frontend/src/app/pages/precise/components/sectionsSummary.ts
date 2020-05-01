import { Component, Input } from "@angular/core";
import { IParticipantCollatedData } from "src/app/stores";
import { IFormMeta } from "src/app/types/types";

@Component({
  selector: "precise-sections-summary",
  template: ` <mat-grid-list
    rowHeight="150px"
    [cols]="gridCols"
    gutterSize="20px"
  >
    <mat-grid-tile
      *ngFor="let section of sections; let i = index"
      colspan="1"
      rowspan="1"
      [class]="'section-tile color-rotate-' + i"
    >
      <mat-grid-tile-header class="primary-inverted">
        <mat-icon class="section-icon" [svgIcon]="section.icon"></mat-icon>
        <span>{{ section.label }}</span></mat-grid-tile-header
      >
      <div class="section-details">
        No Data Recorded
      </div>
    </mat-grid-tile>
  </mat-grid-list>`,
  styles: [
    `
      /* mat-grid-tile:hover {
        transform: scale(1.05);
      } */
      mat-grid-tile {
        transition: all 0.2s ease-in-out;
        background: white;
        border: 4px solid;
        border-radius: 8px;
      }
      mat-grid-tile.disabled {
        transform: none;
        pointer-events: none;
        opacity: 0.5;
      }
      mat-grid-tile-header > .section-icon {
        margin-right: 10px;
      }
      .section-details {
        color: var(--color-black);
      }
    `,
  ],
})
export class PreciseSectionsSummary {
  @Input() participantForms: IFormMeta[];
  sections: any[];
  gridCols = Math.ceil(window.innerWidth / 400);

  ngOnInit() {
    this.sections = Object.values(SECTIONS).map((s) => s);
  }
}

const SECTIONS = {
  visit: {
    label: "Precise Visit",
    icon: "visit",
    url: "/visit",
    forms: [
      {
        id: "",
        allowRepeat: false,
        allowEdit: true,
      },
    ],
  },
  birth: {
    label: "Birth",
    icon: "baby",
    url: "/birth",
  },
  tod: {
    label: "TOD",
    icon: "disease",
    url: "/tod",
  },
  lab: {
    label: "Lab",
    icon: "lab",
    url: "/lab",
  },
};

const FORMS = {};

import { Component, Input } from "@angular/core";
import { IParticipant } from "src/app/stores";
import * as Animations from "src/app/animations";
import {
  IPreciseFieldSummary,
  PRECISE_PROFILE_FIELDS,
} from "src/app/models/participant-summary.model";

@Component({
  selector: "precise-profile-section",
  templateUrl: "profile-section.html",
  styleUrls: ["profile-section.scss", "../../precise-profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class PreciseProfileSectionComponent {
  @Input() participant: IParticipant;
  @Input() participantRevisions: IParticipant[];
  @Input() profileConfirmed: boolean;
  summaryFields: IPreciseFieldSummaryWithMeta[];
  additionalFields: IPreciseFieldSummaryWithMeta[];
  tableHeadings = ["Field", "Value"];

  constructor() {
    this.generateSummary(PRECISE_PROFILE_FIELDS);
  }
  /**
   * Separate the core list of fields into summary and additional expansion content
   * @param fields - default use the full list of fields, but can be overwritten
   * if revision info has been retrieved
   */
  generateSummary(fields: IPreciseFieldSummary[]) {
    this.summaryFields = fields
      .filter((f) => f.grouping !== "Additional")
      .map((f) => ({ ...f, revisions: [] }));
    this.additionalFields = fields
      .filter((f) => f.grouping === "Additional")
      .map((f) => ({ ...f, revisions: [] }));
  }

  /**
   * Generate revision meta on demand
   * @remark - this can't be done in constructor as revision meta
   * populated asynchronously (could use input setter/props change instead)
   */
  showRevisions() {
    const allFields = PRECISE_PROFILE_FIELDS.map((f) => {
      const fieldRevisions = {};
      this.participantRevisions.forEach((rev) => {
        if (rev[f.field] && rev[f.field] !== this.participant[f.field]) {
          fieldRevisions[rev[f.field]] = true;
        }
      });
      return { ...f, revisions: Object.keys(fieldRevisions).reverse() };
    });
    this.generateSummary(allFields);
  }
  hideRevisions() {
    this.summaryFields = this.summaryFields.map((f) => ({
      ...f,
      revisions: [],
    }));
    this.additionalFields = this.additionalFields.map((f) => ({
      ...f,
      revisions: [],
    }));
  }
}

interface IPreciseFieldSummaryWithMeta extends IPreciseFieldSummary {
  revisions: string[];
}

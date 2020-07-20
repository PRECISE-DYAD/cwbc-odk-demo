import { Component, Input } from "@angular/core";
import { IParticipant } from "src/app/stores";
import * as Animations from "src/app/animations";

@Component({
  selector: "precise-profile-summary",
  templateUrl: "profileSummary.html",
  styleUrls: ["profileSummary.scss"],
  animations: [Animations.fadeEntryExit],
})
export class PreciseProfileSummaryComponent {
  @Input() participant: IParticipant;
  @Input() participantRevisions: IParticipant[];
  @Input() profileConfirmed: boolean;
  summaryFields: IFieldMapping[];
  additionalFields: IFieldMapping[];
  tableHeadings = ["Icon", "Field", "Value"];

  constructor() {
    this.generateSummary();
  }
  /**
   * Separate the core list of fields into summary and additional expansion content
   * @param fields - default use the full list of fields, but can be overwritten
   * if revision info has been retrieved
   */
  generateSummary(fields: IFieldMapping[] = FIELD_MAPPINGS) {
    this.summaryFields = fields.filter((f) => !f.additional);
    this.additionalFields = fields.filter((f) => f.additional);
  }

  /**
   * Generate revision meta on demand
   * @remark - this can't be done in constructor as revision meta
   * populated asynchronously (could use input setter/props change instead)
   */
  showRevisions() {
    const allFields = FIELD_MAPPINGS.map((f) => {
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
const FIELD_MAPPINGS: IFieldMapping[] = [
  {
    field: "f2a_national_id",
    label: "National ID",
    icon: "folder_shared",
    revisions: [],
  },
  {
    field: "f2a_full_name",
    label: "Name",
    icon: "person",
    revisions: [],
  },
  {
    field: "f2a_phone_number",
    label: "Phone 1",
    icon: "phone",
    revisions: [],
  },
  {
    field: "f2a_phone_number_2",
    label: "Phone 2",
    icon: "phone",
    revisions: [],
  },
  {
    field: "f2_woman_addr",
    label: "Address",
    icon: "home",
    revisions: [],
  },
  {
    field: "f2_ke_health_facility",
    label: "Health Facility",
    icon: "",
    revisions: [],
    additional: true,
  },
  {
    field: "f2a_cohort",
    label: "Cohort",
    icon: "",
    revisions: [],
    additional: true,
  },
  {
    field: "f2a_hdss",
    label: "HDSS",
    icon: "",
    revisions: [],
    additional: true,
  },
  {
    field: "f3_ethnicity_ke",
    label: "Ethnicity",
    icon: "",
    revisions: [],
    additional: true,
  },
  {
    field: "f3a_dob",
    label: "DOB",
    icon: "",
    revisions: [],
    additional: true,
  },
];
interface IFieldMapping {
  field: string;
  label: string;
  icon: string;
  revisions: string[];
  additional?: boolean;
}

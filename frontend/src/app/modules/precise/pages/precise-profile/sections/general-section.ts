import { Component, Input } from "@angular/core";
import { ISectionWithMeta } from "src/app/modules/precise/models";
import { PreciseStore } from "../../../stores";

@Component({
  selector: "precise-profile-general-section",
  template: `
    <section class="section-details">
      <precise-form-summary
        *ngFor="let form of section.forms"
        [form]="form"
        (entrySelected)="store.launchForm(form, $event)"
      ></precise-form-summary>
    </section>
  `,
  styleUrls: ["../precise-profile.component.scss"],
})
export class PreciseProfileGeneralSectionComponent {
  @Input() section: ISectionWithMeta;
  constructor(public store: PreciseStore) {}
  // Add sections for groups of forms, populating with data form stroe
}

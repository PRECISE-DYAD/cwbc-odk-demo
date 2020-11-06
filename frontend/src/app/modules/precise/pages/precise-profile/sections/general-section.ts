import { Component, Input } from "@angular/core";
import { ISectionWithMeta } from "src/app/modules/precise/models";

@Component({
  selector: "precise-profile-general-section",
  template: `
    <section class="section-details">
      <precise-form-summary
        *ngFor="let form of section.forms"
        [form]="form"
      ></precise-form-summary>
    </section>
  `,
  styleUrls: ["../precise-profile.component.scss"],
})
export class PreciseProfileGeneralSectionComponent {
  @Input() section: ISectionWithMeta;
  // Add sections for groups of forms, populating with data form stroe
}

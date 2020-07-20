import { NgModule } from "@angular/core";

import { PreciseProfileSummaryComponent } from "./profileSummary/profileSummary";
import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";
import { PreciseSectionSummaryComponent } from "./sectionSummary";
import { RouterModule } from "@angular/router";
import { PreciseProfileConfirmationComponent } from "./profileConfirmation";

const PreciseComponents = [
  PreciseProfileSummaryComponent,
  PreciseSectionSummaryComponent,
  PreciseProfileConfirmationComponent,
];
@NgModule({
  declarations: PreciseComponents,
  imports: [CoreComponentsModule, CommonModule, RouterModule],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

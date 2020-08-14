import { NgModule } from "@angular/core";

import { PreciseProfileSummaryComponent } from "./profileSummary/profileSummary";
import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";
import { PreciseSectionSummaryComponent } from "./sectionSummary";
import { RouterModule } from "@angular/router";
import { PreciseProfileConfirmationComponent } from "./profileConfirmation";
import { SavepointTimestamp } from "./savepointTimestampPipe";

const PreciseComponents = [
  PreciseProfileSummaryComponent,
  PreciseSectionSummaryComponent,
  PreciseProfileConfirmationComponent,
  SavepointTimestamp,
];
@NgModule({
  declarations: PreciseComponents,
  imports: [CoreComponentsModule, CommonModule, RouterModule],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

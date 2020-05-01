import { NgModule } from "@angular/core";

import { PreciseProfileSummary } from "./profileSummary";
import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";
import { PreciseSectionsSummary } from "./sectionsSummary";
import { RouterModule } from "@angular/router";

const PreciseComponents = [PreciseProfileSummary, PreciseSectionsSummary];
@NgModule({
  declarations: PreciseComponents,
  imports: [CoreComponentsModule, CommonModule, RouterModule],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

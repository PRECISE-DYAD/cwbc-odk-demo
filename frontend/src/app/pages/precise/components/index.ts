import { NgModule } from "@angular/core";

import { PreciseProfileConfirmation } from "./profileConfirmation";
import { PreciseProfileSummary } from "./profileSummary";
import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";

const PreciseComponents = [PreciseProfileConfirmation, PreciseProfileSummary];
@NgModule({
  declarations: PreciseComponents,
  imports: [CoreComponentsModule, CommonModule],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

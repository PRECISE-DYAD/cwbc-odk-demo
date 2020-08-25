import { NgModule } from "@angular/core";

import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PreciseFormSummaryComponent } from "./preciseFormSummary";
import { PrecisePipesModule } from "../pipes";

const PreciseComponents = [PreciseFormSummaryComponent];
@NgModule({
  declarations: PreciseComponents,
  imports: [
    CoreComponentsModule,
    CommonModule,
    RouterModule,
    PrecisePipesModule,
  ],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

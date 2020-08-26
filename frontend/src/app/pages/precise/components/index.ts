import { NgModule } from "@angular/core";

import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PreciseFormSummaryComponent } from "./preciseFormSummary";
import { PrecisePipesModule } from "../pipes";
import { PreciseFieldSummaryComponent } from "./preciseFieldSummary";
import { MobxAngularModule } from "mobx-angular";

const PreciseComponents = [
  PreciseFormSummaryComponent,
  PreciseFieldSummaryComponent,
];
@NgModule({
  declarations: PreciseComponents,
  imports: [
    CoreComponentsModule,
    CommonModule,
    RouterModule,
    PrecisePipesModule,
    MobxAngularModule,
  ],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

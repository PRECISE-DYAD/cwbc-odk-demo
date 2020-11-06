import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PreciseFormSummaryComponent } from "./preciseFormSummary";
import { PreciseFieldSummaryComponent } from "./preciseFieldSummary";
import { MobxAngularModule } from "mobx-angular";
import { EnrollmentDialogComponent } from "./enrollmentDialog";
import { SharedPipesModule } from "src/app/pipes";

const PreciseComponents = [
  PreciseFormSummaryComponent,
  PreciseFieldSummaryComponent,
  EnrollmentDialogComponent,
];
@NgModule({
  declarations: PreciseComponents,
  imports: [
    CoreComponentsModule,
    CommonModule,
    RouterModule,
    SharedPipesModule,
    MobxAngularModule,
    FormsModule,
  ],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

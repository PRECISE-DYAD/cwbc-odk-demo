import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { SharedComponentsModule } from "src/app/modules/shared/components";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MobxAngularModule } from "mobx-angular";
import { EnrollmentDialogComponent } from "./enrollmentDialog";
import { SharedPipesModule } from "src/app/modules/shared/pipes";

const PreciseComponents = [EnrollmentDialogComponent];
@NgModule({
  declarations: PreciseComponents,
  imports: [
    SharedComponentsModule,
    CommonModule,
    RouterModule,
    SharedPipesModule,
    MobxAngularModule,
    FormsModule,
  ],
  exports: PreciseComponents,
})
export class PreciseComponentsModule {}

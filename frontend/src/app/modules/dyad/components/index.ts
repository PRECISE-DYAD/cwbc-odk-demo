import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SharedComponentsModule } from "src/app/modules/shared/components";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MobxAngularModule } from "mobx-angular";

const DyadComponents = [];
@NgModule({
  declarations: DyadComponents,
  imports: [
    SharedComponentsModule,
    CommonModule,
    RouterModule,
    MobxAngularModule,
    FormsModule,
  ],
  exports: DyadComponents,
})
export class DyadComponentsModule {}

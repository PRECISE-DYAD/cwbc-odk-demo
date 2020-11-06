import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CoreComponentsModule } from "src/app/components";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MobxAngularModule } from "mobx-angular";

const DyadComponents = [];
@NgModule({
  declarations: DyadComponents,
  imports: [
    CoreComponentsModule,
    CommonModule,
    RouterModule,
    MobxAngularModule,
    FormsModule,
  ],
  exports: DyadComponents,
})
export class DyadComponentsModule {}

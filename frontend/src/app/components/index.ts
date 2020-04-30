import { NgModule } from "@angular/core";
import { MaterialComponentsModule } from "./material.components";
import { ODKComponentsModule } from "./odk/odk.components.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CommonComponentsModule } from "./common/common.components.module";

@NgModule({
  declarations: [],
  imports: [
    MaterialComponentsModule,
    CommonModule,
    RouterModule,
    ODKComponentsModule,
    CommonComponentsModule,
  ],
  exports: [
    MaterialComponentsModule,
    ODKComponentsModule,
    CommonComponentsModule,
  ],
})
export class CoreComponentsModule {}

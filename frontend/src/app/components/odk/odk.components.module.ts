import { NgModule } from "@angular/core";
import { MaterialComponentsModule } from "../material.components";
import { OdkTableRowsComponent } from "./odkTableRows/odkTableRows";
import { CommonModule } from "@angular/common";

const customComponents = [OdkTableRowsComponent];

@NgModule({
  declarations: [customComponents],
  imports: [MaterialComponentsModule, CommonModule],
  exports: [customComponents]
})
export class ODKComponentsModule {}

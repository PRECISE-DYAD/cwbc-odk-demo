import { NgModule } from "@angular/core";
import { MaterialComponentsModule } from "../material.components";
import { OdkTableRowsComponent } from "./odkTableRows/odkTableRows";
import { CommonModule } from "@angular/common";
import { ODKFormPopup } from "./odkFormPopup/odkFormPopup";

const customComponents = [OdkTableRowsComponent];

@NgModule({
  entryComponents: [ODKFormPopup],
  declarations: [customComponents, ODKFormPopup],
  imports: [MaterialComponentsModule, CommonModule],
  exports: [customComponents, ODKFormPopup],
})
export class ODKComponentsModule {}

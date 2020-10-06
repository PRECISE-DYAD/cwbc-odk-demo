import { NgModule } from "@angular/core";
import { MaterialComponentsModule } from "../material.components";
import { OdkTableRowsComponent } from "./odkTableRows/odkTableRows";
import { CommonModule } from "@angular/common";
import { ODKFormPopup } from "./odkFormPopup/odkFormPopup";
import { ODKDesignerIframeComponent } from "./odk.designerIframe";
import { ODKRecordsPendingComponent } from "./odk.recordsPending";

const customComponents = [
  OdkTableRowsComponent,
  ODKDesignerIframeComponent,
  ODKRecordsPendingComponent,
];

@NgModule({
  entryComponents: [ODKFormPopup],
  declarations: [customComponents, ODKFormPopup],
  imports: [MaterialComponentsModule, CommonModule],
  exports: [customComponents, ODKFormPopup],
})
export class ODKComponentsModule {}

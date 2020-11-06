import { NgModule } from "@angular/core";
import { MaterialComponentsModule } from "../material.components";
import { OdkTableRowsComponent } from "./odkTableRows/odkTableRows";
import { CommonModule } from "@angular/common";
import { ODKDesignerIframeComponent } from "./odk.designerIframe";
import { ODKRecordsPendingComponent } from "./odk.recordsPending";

const customComponents = [
  OdkTableRowsComponent,
  ODKDesignerIframeComponent,
  ODKRecordsPendingComponent,
];

@NgModule({
  entryComponents: [],
  declarations: [customComponents],
  imports: [MaterialComponentsModule, CommonModule],
  exports: [customComponents],
})
export class ODKComponentsModule {}

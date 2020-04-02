import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumb";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialComponentsModule } from "./material.components";
import { OdkTableRowsComponent } from "./odkTableRows/odkTableRows";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NotificationBarComponent } from "./notificationBar";

const customComponents = [
  BreadcrumbComponent,
  NotificationBarComponent,
  OdkTableRowsComponent
];

@NgModule({
  declarations: [...customComponents],
  imports: [
    MaterialComponentsModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule
  ],
  exports: [...customComponents, MaterialComponentsModule]
})
export class ComponentsModule {}

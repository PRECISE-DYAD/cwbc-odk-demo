import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumb";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialComponentsModule } from "./material.components";
import { OdkTableRowsComponent } from "./odkTableRows/odkTableRows";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [BreadcrumbComponent, OdkTableRowsComponent],
  imports: [
    MaterialComponentsModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    MaterialComponentsModule
  ],
  exports: [
    BreadcrumbComponent,
    OdkTableRowsComponent,
    MaterialComponentsModule
  ]
})
export class ComponentsModule {}

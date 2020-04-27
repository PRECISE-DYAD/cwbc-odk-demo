import { NgModule } from "@angular/core";
import { MaterialComponentsModule } from "../material.components";
import { BreadcrumbComponent } from "./breadcrumb";
import { NotificationBarComponent } from "./notificationBar";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BackButtonComponent } from "./backButton";

const customComponents = [
  BreadcrumbComponent,
  NotificationBarComponent,
  BackButtonComponent,
];

@NgModule({
  declarations: [customComponents],
  imports: [MaterialComponentsModule, CommonModule, RouterModule],
  exports: [customComponents],
})
export class CommonComponentsModule {}

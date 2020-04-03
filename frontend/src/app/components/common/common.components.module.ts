import { NgModule } from "@angular/core";
import { MaterialComponentsModule } from "../material.components";
import { BreadcrumbComponent } from "./breadcrumb";
import { NotificationBarComponent } from "./notificationBar";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

const customComponents = [BreadcrumbComponent, NotificationBarComponent];

@NgModule({
  declarations: [customComponents],
  imports: [MaterialComponentsModule, CommonModule, RouterModule],
  exports: [customComponents]
})
export class CommonComponentsModule {}

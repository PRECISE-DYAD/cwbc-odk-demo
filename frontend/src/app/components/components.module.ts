import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumb";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [
    CommonModule,
    RouterModule,
    // Material components
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule
  ],
  exports: [
    BreadcrumbComponent,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule
  ]
})
export class ComponentsModule {}

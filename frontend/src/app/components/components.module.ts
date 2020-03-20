import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumb";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { OdkTableRowsComponent } from "./odkTableRows/odkTableRows";

@NgModule({
  declarations: [BreadcrumbComponent, OdkTableRowsComponent],
  imports: [
    CommonModule,
    RouterModule,
    // Material components
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule
  ],
  exports: [
    BreadcrumbComponent,
    OdkTableRowsComponent,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule
  ]
})
export class ComponentsModule {}

import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatMenuModule } from "@angular/material/menu";
import { DomSanitizer } from "@angular/platform-browser";
import { registerIcons } from "./icons";

@NgModule({
  exports: [
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatMenuModule,
  ],
  imports: [],
})
export class MaterialComponentsModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    // register icons
    registerIcons(iconRegistry, sanitizer);
  }
}

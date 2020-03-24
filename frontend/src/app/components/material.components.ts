import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@NgModule({
  declarations: [],
  imports: [
    // Material components
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatGridListModule
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatGridListModule
  ]
})
export class MaterialComponentsModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    // register icons
    this.registerIcons(iconRegistry, sanitizer);
  }
  registerIcons(iconRegistry, sanitizer) {
    const icons = [
      "pregnant",
      "add",
      "edit",
      "visit",
      "check",
      "birth",
      "fetus",
      "lab"
    ];
    icons.forEach(i => {
      iconRegistry.addSvgIcon(
        i,
        sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${i}.svg`)
      );
    });
  }
}

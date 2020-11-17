import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedPipesModule } from "../../pipes";
import { MaterialComponentsModule } from "../material.components";
import { FieldSummaryComponent } from "./field-summary";
import { FieldSummaryTableComponent } from "./field-summary-table";
import { FormEntriesSummaryComponent } from "./form-entries-summary";

const components = [
  FieldSummaryComponent,
  FieldSummaryTableComponent,
  FormEntriesSummaryComponent,
];

@NgModule({
  imports: [CommonModule, MaterialComponentsModule, SharedPipesModule],
  exports: components,
  declarations: components,
  providers: [],
})
/**
 * Common components shared across precise and dyad projects
 */
export class CWBCComponentsModules {}

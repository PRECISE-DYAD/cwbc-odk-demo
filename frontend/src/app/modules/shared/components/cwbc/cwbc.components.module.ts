import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FieldSummaryComponent } from "./field-summary";
import { FieldSummaryTableComponent } from "./field-summary-table";

const components = [FieldSummaryComponent, FieldSummaryTableComponent];

@NgModule({
  imports: [CommonModule],
  exports: components,
  declarations: components,
  providers: [],
})
/**
 * Common components shared across precise and dyad projects
 */
export class CWBCComponentsModules {}

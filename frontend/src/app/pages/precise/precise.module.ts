import { NgModule } from "@angular/core";

import { PreciseProfileConfirmation } from "./components/profileConfirmation";
import { PreciseProfileSummary } from "./components/profileSummary";
import { ComponentsModule } from "src/app/components/components.module";
import { Routes, RouterModule } from "@angular/router";
import { PreciseHomeComponent } from "./precise.component";
import { CommonModule } from "@angular/common";
import { PreciseProfileComponent } from "./profile/profile.component";

const PreciseComponents = [PreciseProfileConfirmation, PreciseProfileSummary];
const routes: Routes = [
  {
    path: "",
    component: PreciseHomeComponent,
    data: { title: "Precise", animation: "precise" },
  },
  {
    path: ":participantId",
    component: PreciseProfileComponent,
    data: { animation: "participant" },
  },
];

@NgModule({
  imports: [ComponentsModule, CommonModule, RouterModule.forChild(routes)],
  exports: PreciseComponents,
  declarations: PreciseComponents,
})
export class PreciseModule {}

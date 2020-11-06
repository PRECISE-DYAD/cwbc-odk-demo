import { NgModule } from "@angular/core";

import { SharedComponentsModule } from "src/app/modules/shared/components";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PreciseComponentsModule } from "./components";
import { MobxAngularModule } from "mobx-angular";
import { PreciseStore } from "./stores";
import remotedev from "mobx-remotedev/lib/dev";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import { PreciseParticipantsComponent } from "./pages/precise-participants/precise-participants.component";
import { PreciseHomeComponent } from "./pages/precise-home/precise-home.component";
import { PreciseProfileComponent } from "./pages/precise-profile/precise-profile.component";
import { PreciseProfileGeneralSectionComponent } from "./pages/precise-profile/sections/general-section";
import { PreciseScreeningComponent } from "./pages/precise-screening/precise-screening.component";
import { PreciseProfileSectionComponent } from "./pages/precise-profile/sections/profile-section/profile-section";
import { PreciseProfileConfirmationComponent } from "./pages/precise-profile/sections/profile-confirmation";
import { PreciseProfileSummarySectionComponent } from "./pages/precise-profile/sections/summary-section";
import { PreciseProfileBabySectionComponent } from "./pages/precise-profile/sections/baby-section";
import { SharedPipesModule } from "src/app/modules/shared/pipes";

const routes: Routes = [
  {
    path: "",
    component: PreciseHomeComponent,
    data: { title: "Precise", animation: "precise" },
  },
  {
    path: "participants",
    component: PreciseParticipantsComponent,
    data: { title: "Participants", animation: "precise" },
  },
  {
    path: "screening",
    component: PreciseScreeningComponent,
    data: { title: "Screening", animation: "precise" },
  },

  {
    path: "participants/:f2_guid",
    component: PreciseProfileComponent,
    data: { animation: "precise" },
  },
];

@NgModule({
  declarations: [
    PreciseHomeComponent,
    PreciseProfileComponent,
    PreciseProfileGeneralSectionComponent,
    PreciseProfileBabySectionComponent,
    PreciseProfileSectionComponent,
    PreciseProfileSummarySectionComponent,
    PreciseProfileConfirmationComponent,
    PreciseScreeningComponent,
    PreciseParticipantsComponent,
  ],
  imports: [
    SharedComponentsModule,
    CommonModule,
    RouterModule.forChild(routes),
    PreciseComponentsModule,
    MobxAngularModule,
    SharedPipesModule,
  ],
  exports: [PreciseComponentsModule],
  providers: [
    {
      provide: PreciseStore,
      useClass: remotedev(PreciseStore, { global: true, onlyActions: true }),
      deps: [OdkService],
    },
  ],
})
export class PreciseModule {}

import { NgModule } from "@angular/core";

import { CoreComponentsModule } from "src/app/components";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PreciseComponentsModule } from "./components";
import { MobxAngularModule } from "mobx-angular";
import { PreciseStore } from "src/app/stores";
import remotedev from "mobx-remotedev";
import { OdkService } from "src/app/services/odk/odk.service";
import { NotificationService } from "src/app/services/notification/notification.service";
import { PreciseParticipantsComponent } from "./precise-participants/precise-participants.component";
import { PreciseHomeComponent } from "./precise-home/precise-home.component";
import { PreciseProfileComponent } from "./precise-profile/precise-profile.component";

const routes: Routes = [
  {
    path: "",
    component: PreciseHomeComponent,
    data: { title: "Precise", animation: "precise" },
  },
  {
    path: "participants",
    component: PreciseParticipantsComponent,
    data: { title: "Precise", animation: "precise" },
  },

  {
    path: "participants/:participantId",
    component: PreciseProfileComponent,
    data: { animation: "precise" },
  },
];

@NgModule({
  declarations: [
    PreciseHomeComponent,
    PreciseProfileComponent,
    PreciseParticipantsComponent,
  ],
  imports: [
    CoreComponentsModule,
    CommonModule,
    RouterModule.forChild(routes),
    PreciseComponentsModule,
    MobxAngularModule,
  ],
  providers: [
    {
      provide: PreciseStore,
      useClass: remotedev(PreciseStore, { global: true, onlyActions: true }),
      deps: [OdkService, NotificationService],
    },
  ],
})
export class PreciseModule {}

import { NgModule } from "@angular/core";

import { CoreComponentsModule } from "src/app/components";
import { Routes, RouterModule } from "@angular/router";
import { PreciseHomeComponent } from "./precise.component";
import { CommonModule } from "@angular/common";
import { PreciseProfileComponent } from "./profile/profile.component";
import { PreciseComponentsModule } from "./components";
import { MobxAngularModule } from "mobx-angular";
import { PreciseStore } from "src/app/stores";
import remotedev from "mobx-remotedev";
import { OdkService } from "src/app/services/odk/odk.service";
import { NotificationService } from "src/app/services/notification/notification.service";

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
  declarations: [PreciseHomeComponent, PreciseProfileComponent],
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

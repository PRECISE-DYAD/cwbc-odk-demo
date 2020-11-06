import { NgModule } from "@angular/core";
import { CoreComponentsModule } from "src/app/components";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MobxAngularModule } from "mobx-angular";
import { PreciseStore } from "src/app/stores";
import remotedev from "mobx-remotedev";
import { OdkService } from "src/app/services/odk/odk.service";
import { SharedPipesModule } from "src/app/pipes";
import { DyadParticipantsComponent, DyadProfileComponent } from "./pages";
import { DyadComponentsModule } from "./components";
import { DyadStore } from "./dyad.store";

const routes: Routes = [
  {
    path: "",
    // no dyad home, so for now just redirect to app root
    redirectTo: "/",
    pathMatch: "full",
  },
  {
    path: "participants",
    component: DyadParticipantsComponent,
    data: { title: "Participants", animation: "dyad" },
  },

  {
    path: "participants/:f2_guid",
    component: DyadProfileComponent,
    data: { animation: "dyad" },
  },
];

@NgModule({
  declarations: [DyadParticipantsComponent, DyadProfileComponent],
  imports: [
    CoreComponentsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MobxAngularModule,
    SharedPipesModule,
  ],
  exports: [DyadComponentsModule],
  providers: [
    {
      provide: PreciseStore,
      useClass: remotedev(PreciseStore, { global: true, onlyActions: true }),
      deps: [OdkService],
    },
    {
      provide: DyadStore,
      useClass: remotedev(DyadStore, { global: true, onlyActions: true }),
      deps: [OdkService],
    },
  ],
})
export class DyadModule {}

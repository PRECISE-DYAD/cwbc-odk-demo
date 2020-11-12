import { NgModule } from "@angular/core";
import { SharedComponentsModule } from "src/app/modules/shared/components";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MobxAngularModule } from "mobx-angular";
import { SharedPipesModule } from "src/app/modules/shared/pipes";
import { DyadParticipantsComponent, DyadProfileComponent } from "./pages";
import { DyadComponentsModule } from "./components";
import { PreciseComponentsModule } from "../precise/components";
import { CWBCComponentsModules } from "../shared/components/cwbc/cwbc.components.module";

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
    SharedComponentsModule,
    CWBCComponentsModules,
    PreciseComponentsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MobxAngularModule,
    SharedPipesModule,
  ],
  exports: [DyadComponentsModule],
  providers: [],
})
export class DyadModule {}

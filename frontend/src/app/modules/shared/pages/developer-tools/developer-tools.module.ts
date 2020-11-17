import { NgModule } from "@angular/core";
import { SharedComponentsModule } from "src/app/modules/shared/components";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MobxAngularModule } from "mobx-angular";
import { DeveloperToolsComponent } from "./developer-tools.component";

const routes: Routes = [
  {
    path: "",
    component: DeveloperToolsComponent,
    data: { title: "Developer Tools", animation: "developer-tools" },
  },
];

@NgModule({
  declarations: [],
  imports: [
    SharedComponentsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MobxAngularModule,
  ],
  exports: [],
  providers: [],
})
export class DeveloperToolsModule {}

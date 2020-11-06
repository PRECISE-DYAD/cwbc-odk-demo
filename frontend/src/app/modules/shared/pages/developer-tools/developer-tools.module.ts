import { NgModule } from "@angular/core";
import { CoreComponentsModule } from "src/app/components";
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
    CoreComponentsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MobxAngularModule,
  ],
  exports: [],
  providers: [],
})
export class DeveloperToolsModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MobxAngularModule } from "mobx-angular";
import { SharedComponentsModule } from "./components";

import { DeveloperToolsComponent } from "./pages/developer-tools/developer-tools.component";
import { HomeComponent } from "./pages/home/home.component";
import { InstallComponent } from "./pages/install/install.component";
import { SharedPipesModule } from "./pipes";

const Pages = [HomeComponent, DeveloperToolsComponent, InstallComponent];

@NgModule({
  imports: [
    SharedComponentsModule,
    CommonModule,
    MobxAngularModule,
    SharedPipesModule,
    RouterModule,
  ],
  exports: [SharedComponentsModule, SharedPipesModule],
  declarations: [...Pages],
})
export class SharedModule {}

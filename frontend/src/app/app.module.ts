import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RouterModule, Router } from "@angular/router";
// stores
import { MobxAngularModule } from "mobx-angular";
import remotedev from "mobx-remotedev";
import { CommonStore, PreciseStore } from "./stores";
import { OdkService } from "./services/odk/odk.service";
// custom components
import { ComponentsModule } from "./components/components.module";
import { CommonModule } from "@angular/common";
// pages
import { HomeComponent } from "./pages/home/home.component";
import { PreciseHomeComponent } from "./pages/precise/precise.component";
import { PreciseProfileComponent } from "./pages/precise/profile/profile.component";
import { NotificationService } from "./services/notification/notification.service";
import { InstallComponent } from "./pages/install/install.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreciseHomeComponent,
    PreciseProfileComponent,
    InstallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    MobxAngularModule,
    ComponentsModule,
  ],
  providers: [
    {
      provide: CommonStore,
      useClass: remotedev(CommonStore, { global: true, onlyActions: true }),
      deps: [Router],
    },
    {
      provide: PreciseStore,
      useClass: remotedev(PreciseStore, { global: true, onlyActions: true }),
      deps: [OdkService, NotificationService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

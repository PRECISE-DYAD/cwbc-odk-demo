import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

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
// pages
import { HomeComponent } from "./pages/home/home.component";
import { PreciseHomeComponent } from "./pages/precise/precise.component";
import { PreciseProfileComponent } from "./pages/precise/profile/profile.component";
import { NotificationService } from "./services/notification/notification.service";
import { InstallComponent } from "./pages/install/install.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

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
    BrowserAnimationsModule,
    AppRoutingModule,
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

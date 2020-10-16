import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RouterModule, Router } from "@angular/router";
// stores
import { MobxAngularModule } from "mobx-angular";
import remotedev from "mobx-remotedev";
import { CommonStore } from "./stores";
// custom components
import { CoreComponentsModule } from "./components";
// pages
import { HomeComponent } from "./pages/home/home.component";
import { InstallComponent } from "./pages/install/install.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// error handling
import { createErrorHandler as createSentryErrorHandler } from "@sentry/angular";
import { ODKComponentsModule } from "./components/odk/odk.components.module";
import { DeveloperToolsComponent } from './pages/developer-tools/developer-tools.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, InstallComponent, DeveloperToolsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    MobxAngularModule,
    CoreComponentsModule,
    ODKComponentsModule,
  ],
  providers: [
    {
      provide: CommonStore,
      useClass: remotedev(CommonStore, { global: true, onlyActions: true }),
      deps: [Router],
    },
    {
      provide: ErrorHandler,
      useValue: createSentryErrorHandler({
        showDialog: false,
      }),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

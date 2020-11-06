import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RouterModule, Router } from "@angular/router";
// stores
import { MobxAngularModule } from "mobx-angular";
import remotedev from "mobx-remotedev";
import { CommonStore } from "./modules/shared/stores";
// custom components
// pages
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// error handling
import { createErrorHandler as createSentryErrorHandler } from "@sentry/angular";
import { ODKComponentsModule } from "./modules/shared/components";
import { SharedModule } from "./modules/shared/shared.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    MobxAngularModule,
    ODKComponentsModule,
    SharedModule,
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

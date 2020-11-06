import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { init as sentryInit } from "@sentry/angular";

if (environment.production) {
  enableProdMode();
  if (environment.SENTRY_DSN) {
    sentryInit({ dsn: environment.SENTRY_DSN });
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

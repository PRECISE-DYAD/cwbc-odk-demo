import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { init as sentryInit } from "@sentry/angular";

if (environment.production) {
  sentryInit({
    dsn:
      "https://6e0349ddbf724d77bce8b5adef4cbf4a@o443859.ingest.sentry.io/5418172",
    integrations: [],
  });
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

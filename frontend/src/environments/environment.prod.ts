import { IEnvironment } from "src/app/modules/shared/types";

/**
 * This is the default production build that is used via `npm run build` if
 * no specific site is selected
 */
export const environment: Partial<IEnvironment> = {
  production: true,
  SENTRY_DSN:
    "https://6e0349ddbf724d77bce8b5adef4cbf4a@o443859.ingest.sentry.io/5418172",
};

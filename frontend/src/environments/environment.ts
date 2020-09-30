import { IEnvironment } from "src/app/types/types";

/**
 * This is the default environment used during development mode, i.e. `npm run start`
 * Modify to match any of the site-specific environments for testing
 */
export const environment: IEnvironment = {
  SITE: "gambia",
  COUNTRY_CODE: "220",
  production: false,
  SENTRY_DSN: "",
  tableMapping: {
    Visit1: "Visit1_v2",
    Visit2: "Visit2_v2",
  },
  formMapping: {
    Visit1: "Visit1_v2",
    Visit2: "Visit2_v2",
  },
};

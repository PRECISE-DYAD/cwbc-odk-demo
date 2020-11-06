import { IEnvironment } from "src/app/types/types";

export const environment: IEnvironment = {
  SITE: "kenya",
  COUNTRY_CODE: "254",
  production: true,
  SENTRY_DSN:
    "https://6e0349ddbf724d77bce8b5adef4cbf4a@o443859.ingest.sentry.io/5418172",
  tableMapping: {
    Visit1: "Visit1_v2",
    Visit2: "Visit2_v2",
    TOD_ANC: "TOD_ANC_v2",
    Birthmother: "Birthmother_v2",
    Postpartum_mother: "Postpartum_mother_v2",
  },
  formMapping: {
    Visit1: "Visit1_v2",
    Visit2: "Visit2_v2",
    TOD_ANC: "TOD_ANC_v2",
    Birthmother: "Birthmother_v2",
    Postpartum_mother: "Postpartum_mother_v2",
  },
};

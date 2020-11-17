import { IEnvironment } from "src/app/modules/shared/types";

export const environment: IEnvironment = {
  SITE: "kenya",
  COUNTRY_CODE: "254",
  production: true,
  SENTRY_DSN: "",
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

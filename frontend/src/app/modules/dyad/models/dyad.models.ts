import { IFormMeta } from "src/app/modules/shared/types";

export const DYAD_TABLE_IDS = [
  "dyad_visit1",
  "dyad_visit2",
  "dyad_enrollment",
] as const;
export type IDyadTableId = typeof DYAD_TABLE_IDS[number];
export const DYAD_SCHEMA: { [tableId in IDyadTableId]: IFormMeta } = {
  dyad_visit1: {
    title: "Dyad Visit 1",
    formId: "dyad_visit1",
    tableId: "dyad_visit1",
    icon: "visit",
    mapFields: [],
  },
  dyad_visit2: {
    title: "Dyad Visit 2",
    formId: "dyad_visit2",
    tableId: "dyad_visit2",
    icon: "visit",
    mapFields: [],
  },
  dyad_enrollment: {
    title: "Dyad Enrollment",
    formId: "dyad_enrollment",
    tableId: "dyad_enrollment",
    icon: "visit",
    mapFields: [],
  },
};

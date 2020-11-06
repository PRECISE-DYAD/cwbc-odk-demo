// re-export types from frontend code
export * from "../../frontend/src/app/modules/shared/types/odk.types";

/**
 * Stats calculated when iterating through a section
 * @property answered  - shown to user, answered
 * @property skipped   - shown to user, not answered
 * @property missing   - shown to user, not answered, required
 */
export interface ISectionSummary {
  sectionName?: string;
  responses: { [fieldName: string]: any };
  skipped: { [fieldName: string]: "" };
  missing: { [fieldName: string]: "" };
}
export type ISectionSummaryGroup = keyof ISectionSummary;

/**
 * Additional stats calculated when looking at overall data structure
 * @property hidden  - shown to user, answered
 * @property invalid  - shown to user, answered
 */
interface ISurveySummary extends ISectionSummary {
  hidden: { [fieldname: string]: true };
  invalid: { [fieldname: string]: true };
}

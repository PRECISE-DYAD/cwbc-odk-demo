import { IODkTableRowData } from "../../shared/types";
import { IFormSchema } from "./dyad.models";

/**
 * General Note - many of the types here started from precise typings, but were then changed without changing precise
 * (e.g. formMeta vs formSchema). As such not all the same methods can be applied to precise methods.
 * In the future they should be merged and made consistent
 */

/************************************************************************************
 *  Constants - Used for data population
 ************************************************************************************/
/**
 * Masterlist of all table IDs
 * This is used to type-check other fields
 */
export const DEVICE_FORM_TABLE_IDS = ["dyad_randomisation"] as const;

/**
 * Metadata for tables. See full set of options in IFormSchema below.
 * @see {IFormSchema}
 */
const FORM_SCHEMA_BASE: { [tableId in IDeviceFormTableId]: IFormSchema } = {
  dyad_randomisation: { title: "Dyad Randomisation", allowRepeats: true },
};

/** active device data is a hybrid of formsHash and participant data types */
export type IActiveDevice = { device_id: string } & IActiveDeviceFormData;
type IActiveDeviceFormData = { [tableId in IDeviceFormTableId]: { _rows: IODkTableRowData[] } };

/************************************************************************************
 *  Interfaces used for type-checking
 ************************************************************************************/

export type IDeviceFormTableId = typeof DEVICE_FORM_TABLE_IDS[number];

/************************************************************************************
 *  Additional Export Functions
 ************************************************************************************/
/** when exporting automatically populate table and form ids when not specified using key */
Object.entries(FORM_SCHEMA_BASE).forEach(([id, schema]) => {
  schema.tableId = schema.tableId || id;
  schema.formId = schema.formId || id;
});
export const DEVICE_FORM_SCHEMA = FORM_SCHEMA_BASE as {
  [tableId in IDeviceFormTableId]: IFormSchema & {
    formId: IDeviceFormTableId;
    tableId: IDeviceFormTableId;
  };
};

/**
 * The customCalculations file works with the customScreenType to make available functions
 * defined in this file to all prompts. Calculations defined here can also be called with
 * arguments from within odk calculations
 *
 * Calculations can either be included here to be made available within all tables,
 * or a copy of this file can be placed in a form folder
 * (e.g. `tables/dyad_visit/forms/dyad_visit`/customCalculations.js`)
 * to be available only for a specific table.
 */

define(function () {
  return {
    /***********************************************************************************
     * Define all custom calculation functions here
     * They will be available on any screen defined with the customScreenType,
     * accessed from within the calculates.custom property,
     * e.g. `var customValue = calculates.custom.exampleCalc('hello')`
     ***********************************************************************************/
    exampleCalc: (arg1) => {
      return arg1;
    },
  };
});

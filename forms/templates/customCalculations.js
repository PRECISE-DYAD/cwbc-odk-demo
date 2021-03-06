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
      return `The data supplied was: ${typeof arg1}: ${arg1}`;
    },
    mdat_gm: (arg1, data) => {
      function coalesce(value) {
        const parsed = parseInt(value);
        return Number.isNaN(parsed) ? 1 : parsed;
      }
      function sumCoalesce(n) {
        let i = 1;
        let sum = 0;
        for (i = 1; i < n; i++) {
          sum += coalesce(data(`gm${i}_yn`));
        }
        return sum > 0 && !data(`gm${i}_yn`);
      }
      console.log("-------------------- data: ", data);
      console.log("-------------------- arg1: ", arg1);
      let age_months = data("age_months") ? parseInt(data("age_months")) : undefined;
      let x = arg1; // gm2 condition
      console.log("-------------------- x: ", x);
      console.log("-------------------- data(`gm1_yn`): ", data(`gm1_yn`));
      console.log("-------------------- age_months:", age_months);
      console.log("-------------------- sumCoalesce(x):", sumCoalesce(x));
      return age_months && age_months < x + 1 ? sumCoalesce(x) : age_months === x + 1;
    },
  };
});

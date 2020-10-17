import chalk from "chalk";
import * as fs from "fs-extra";
import rows from "../inputs/rows.json";
import formDef from "../inputs/formDef.json";
import { SurveySummary } from "./surveySummary";
import { IFormDef } from "../../frontend/src/app/types/odk.types";

console.error = (...args) => console.log(chalk.bgRed.white(...args));
console.info = (...args) => console.log(chalk.gray(...args));

function run() {
  const response = rows[0];
  const dataHash = {};
  response.orderedColumns.forEach((c) => (dataHash[c.column] = c.value));
  const { allSectionSummaries } = new SurveySummary(
    formDef as IFormDef,
    "survey",
    dataHash
  );
  // extract section labels - assumes they are first values_list from survey page
  const labels = getFormSectionLabels("my_branch");
  const summariesWithLabels = allSectionSummaries.map((s) => ({
    sectionLabel: labels[s.sectionName] ? labels[s.sectionName] : s.sectionName,
    ...s,
  }));
  // console.log(summariesWithLabels);
  fs.writeFileSync(
    "outputs/summaries.json",
    JSON.stringify(summariesWithLabels, null, 2)
  );
}
run();

function getFormSectionLabels(choicesListName: string) {
  // TODO - find way to determine correct list or handle when there are not sections
  const labelsBySection = {};
  formDef.xlsx.choices.forEach((c) => {
    if (c.choice_list_name === choicesListName) {
      labelsBySection[c.data_value] = c.display.title.text;
    }
  });
  return labelsBySection;
}

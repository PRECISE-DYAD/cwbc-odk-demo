import { IDyadParticipantData, IFormSchema } from "./dyad.models";

export const DYAD_RANDOMISATION_SCHEMA: IFormSchema = {
  title: "Dyad Randomisation",
  is_device_form: true,
  show_summary_table: true,
  disabled: () => true,
  allow_new_mapFields_row: true,
  mapFields: [
    {
      summary_label: "Participant ID",
      calculation: (data) => data.profileSummary.f2a_participant_id,
      mapped_field_name: "f2a_participant_id",
      write_updates: true,
    },
    {
      summary_label: "Cohort",
      calculation: (data) => data.profileSummary.f2a_cohort,
      mapped_field_name: "f2a_cohort",
      write_updates: true,
    },
    {
      summary_label: "Quality of case - selected",
      calculation: (data) => calcRandomisation(data, true).qoc_case_selected,
      mapped_field_name: "qoc_case_selected",
      write_updates: true,
    },
    {
      summary_label: "Mental health case - selected",
      calculation: (data) => calcRandomisation(data).mental_health_case_selected,
      mapped_field_name: "mental_health_case_selected",
      write_updates: true,
    },
    {
      summary_label: "Pelvic floor case - selected",
      calculation: (data) => calcRandomisation(data).pelvic_floor_case_selected,
      mapped_field_name: "pelvic_floor_case_selected",
      write_updates: true,
    },
    {
      summary_label: "Control - selected",
      calculation: (data) => calcRandomisation(data).control_selected,
      mapped_field_name: "control_selected",
      write_updates: true,
    },
    {
      summary_label: "Quality of case - final",
      calculation: (data) => calcRandomisation(data).qoc_case_final,
      mapped_field_name: "qoc_case_final",
      write_updates: true,
    },
    {
      summary_label: "Mental health case - final",
      calculation: (data) => calcRandomisation(data).mental_health_case_final,
      mapped_field_name: "mental_health_case_final",
      write_updates: true,
    },
    {
      summary_label: "Pelvic floor case - final",
      calculation: (data) => calcRandomisation(data).pelvic_floor_case_final,
      mapped_field_name: "pelvic_floor_case_final",
      write_updates: true,
    },
    {
      summary_label: "Control - final",
      calculation: (data) => calcRandomisation(data).control_final,
      mapped_field_name: "control_final",
      write_updates: true,
    },
  ],
};
function calcRandomisation(data: IDyadParticipantData, includeLogs = false) {
  // add a custom logging function to prevent duplicate logs when function repeated
  const log: (...d: any[]) => void = includeLogs ? console.log : () => null;

  log("calculate randomisation", data.dyad_randomisation._rows);

  // Look at any existing data first - if finalised do not modify (return full data)
  let {
    qoc_case_final,
    mental_health_case_final,
    pelvic_floor_case_final,
    control_final,
  } = data.dyad_randomisation;
  if (
    qoc_case_final === 1 ||
    mental_health_case_final === 1 ||
    pelvic_floor_case_final === 1 ||
    control_final !== null
  ) {
    log("calc already finalised, not changing");
    return data.dyad_randomisation;
  }

  // Process randomisation
  // TODO - these will be populated from additional methods
  const qoc_case_eligible = 1;
  const mental_health_case_eligible = 1;
  const pelvic_floor_case_eligible = 1;
  const qoc_control_eligible = 1;

  // calculated totals, based on if confirmed to final
  const qoc_case_number = data.dyad_randomisation._rows.filter((r) => r.qoc_case_final === 1)
    .length;
  const qoc_control_number = data.dyad_randomisation._rows.filter(
    (r) => r.qoc_control_final === "qoc"
  ).length;

  log({ qoc_case_number, qoc_control_number });

  // default values
  let qoc_case_selected = 0;
  let mental_health_case_selected = 0;
  let pelvic_floor_case_selected = 0;
  let control_selected = null;

  if (qoc_case_eligible == 1) {
    qoc_case_selected = 1;
  }
  if (mental_health_case_eligible == 1) {
    mental_health_case_selected = 1;
  }
  if (pelvic_floor_case_eligible == 1) {
    pelvic_floor_case_selected = 1;
  }
  if (qoc_control_eligible == 1) {
    if (qoc_case_number > qoc_control_number) {
      control_selected = "qoc";
    }
  }

  // TODO - these will be populated from additional methods
  if (data.dyad_visit1._rows.length > 0) {
    log("Visit 1 complete, confirming randomisation");
    qoc_case_final = qoc_case_selected;
    mental_health_case_final = mental_health_case_selected;
    pelvic_floor_case_final = pelvic_floor_case_selected;
    control_final = control_selected;
  }

  return {
    qoc_case_selected,
    mental_health_case_selected,
    pelvic_floor_case_selected,
    control_selected,
    qoc_case_final,
    mental_health_case_final,
    pelvic_floor_case_final,
    control_final,
  };
}

# Precise Forms

## Showing Forms in the App

All forms are registered in the `PRECISE_SCHEMA` variable defined in [`frontend/src/app/models/precise.models.ts`](../frontend/src/app/models/precise.models.ts), and can be made available to a specific section via the `PRECISE_FORM_SECTIONS` variable.

## Summary Tables and Calculations

Some of the data displayed in different pages is collated from multiple tables,
with addtional calculation steps. These are defined and edited from [`frontend/src/app/models/participant-summary.model.ts`](../frontend/src/app/models/participant-summary.model.ts)

## Sharing data between forms

By default all forms receive the `f2_guid` identifier, and as such should include within the form model definition.

Any additional fields that need to be accessed from another form should be included in the `mapFields` property of the schema above.

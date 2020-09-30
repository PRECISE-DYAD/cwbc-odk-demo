# Precise Forms

## Showing Forms in the App

All forms are registered in the `PRECISE_SCHEMA` variable defined in [`frontend/src/app/models/precise.models.ts`](../frontend/src/app/models/precise.models.ts), and can be made available to a specific section via the `PRECISE_FORM_SECTIONS` variable.

## Summary Tables and Calculations

Some of the data displayed in different pages is collated from multiple tables,
with addtional calculation steps. These are defined and edited from [`frontend/src/app/models/participant-summary.model.ts`](../frontend/src/app/models/participant-summary.model.ts)

## Sharing data between forms

By default all forms receive the `f2_guid` identifier, and as such should include within the form model definition.

Any additional fields that need to be accessed from another form should be included in the `mapFields` property of the schema above.

## Changing form names

A limitation with ODK-X is that you cannot easily change form data structures once data collection has been started. The current best-solution is to simply recreate the table using an alternative name. 

To keep code simpler (particularly across sites), all original hardcoded table names are retained and changes to those names are recorded in site-specific environment files, e.g. [`frontend/src/environments/environment.gambia.ts`](../frontend/src/environments/environment.gambia.ts)

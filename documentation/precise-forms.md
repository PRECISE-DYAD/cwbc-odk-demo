## Showing Forms in the App

All forms are registered in the `PRECISE_SCHEMA` variable defined in [`frontend/src/app/models/precise.models.ts`](../frontend/src/app/models/precise.models.ts), and can be made available to a specific section via the `PRECISE_FORM_SECTIONS` variable.

## Sharing data between forms
By default all forms receive the `f2_guid` identifier, and as such should include within the form model definition. 

Any additional fields that need to be accessed from another form should be included in the `mapFields` property of the schema above.

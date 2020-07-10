## Showing Forms in the App

All forms are registered in the `PRECISE_SCHEMA` variable defined in [`frontend/src/app/models/precise.models.ts`](../frontend/src/app/models/precise.models.ts), and can be made available to a specific section via the `PRECISE_FORM_SECTIONS` variable.

## Sharing data between forms

By default all forms receive the `f2_guid` identifier, and as such should include within the form model definition.

Any additional fields that need to be accessed from another form should be included in the `mapFields` property of the schema above.

## Updating files on the server

Scripts are available to update data on the server, accessible through an interactive options system by running:

```
npm run upload
```

This provides options for:

- App files
- Table Definitions
- CSV Table rows

### App files

This will upload anything modified in `frontend/src` or `forms/templates`.
The action is non-breaking, static assets can be updated independently of table data.

### Table Definitions

This will upload anything modified in `forms/tables`.
This takes part in two stages:

1. Schema
   Table columns will be analysed from the generated `definition.csv` file for each table and compared with those on the server. If different schema exist locally and on the server (e.g. questions with new variables either added or removed), then the operation will not be able to continue.

Otherwise the script will continue to CREATE, DELETE, or IGNORE the table as appropriate

2. Table Files
   All other changes to forms will update in a similar way to app files.

### CSV Table rows

This will upload anything modified in `forms/csv`.
Data with matching row etags will be replaced. Data can only be modified either through web interface or uploading rows with `deleted` field marked as `TRUE`

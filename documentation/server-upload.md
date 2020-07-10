# Server Uploads

## Initialising a new server

When an odkx-sync server is first initialised the following steps should be taken:

1. Configure the server settings in the project [.env](../.env) file

2. Ensure local project built
   This will process and copy any forms as well as build the frontend code.

   ```
   npm run build
   ```

3. Upload table definitions and files to server

   ```
   npm run upload
   ```
   Run this twice, once selecting `App files` and once selecting `Table Definitions`. 
   
   Optionally, run a third time with `CSV Table Rows` if you have csv files to prepopulate data.


## Clearing all data from a server

This is best done using `ODK Suitcase`.
Note, It may throw an error at the end of step 2, but usually this shouldn't be an issue. Check the web-ui manually to confirm tables deleted.

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

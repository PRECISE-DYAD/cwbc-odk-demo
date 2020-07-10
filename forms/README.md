This folder acts as a helper for quickly updating forms within the designer and app.

## Folder Structure

The root level should contain a `framework.xlsx` file.

The rest of the file structure contains:

`csv` - Any csv files used to initialise data, defined in the `tables.init` file (see data preloading note below)

`tables`- the nested folder structure for ODK Tables, e.g.,

```
  exampleTable
    forms
      exampleTable
        exampleTable.xlsx
```

`templates` - Any custom .handlebars templates used in surveys (see custom templates note below)

## Data Preloading

Use the `tables.init` file to define tables and corresponding csv files to preload,
this will be copied to the designer `app/config/assets` directory

CSV files should be populated in the `csv` folder and will be copied to `app/config/assets/csv`.

NOTE - whilst ODK supports additional filename separators for csv
(e.g. `exampleTable.demo.csv`), only files explicitly named as `{tableId}.csv`
will be made available to frontend during development

NOTE - as there are many metadata fields that also need to be populated it is probably easiest to complete in ODK Survey and use the ODK Tables export feature to generate. This can be accessed through the Tables list page via the right-arrow icon.

## Custom Templates

Custom templates can be included in any table folder and linked using relative paths, e.g. if `custom_template.handlebars` is in the same folder as `myForm.xlsx`, simply link the `templatePath` as `custom_template.handlebars` in the file.

If reusing templates, they can be placed in the `templates` folder and will be automatically copied to the assets folder of the build, available at `../../../../assets/templates/custom_template.handlebars`

See both examples in the `exampleTable.xlsx` form

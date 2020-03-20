This folder acts as a helper for quickly updating forms within the designer and app.

The root level should contain a `framework.xlsx` file.

The tables folder should contain the nested folder structure for ODK Tables, e.g.,

```
tables/
  exampleTable/
    forms/
      exampleTable/
        exampleTable.xlsx
```

## Data Preloading

Use the `tables.init` file to define tables and corresponding csv files to preload,
this will be copied to the designer `app/config/assets` directory

CSV files should be populated in the `csv` folder and will be copied to `app/config/assets/csv`.

NOTE - whilst ODK supports additional filename separators for csv
(e.g. `exampleTable.demo.csv`), only files explicitly named as `{tableId}.csv`
will be made available to frontend during development

NOTE - as there are many metadata fields that also need to be populated it is probably easiest to complete in ODK Survey and use the ODK Tables export feature to generate. This can be accessed through the Tables list page via the right-arrow icon.

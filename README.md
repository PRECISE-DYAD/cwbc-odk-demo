# ODK Precise demo

## Useful Links

-   Folder Structure  
    https://docs.opendatakit.org/odk-x/app-designer-directories/
-   Application Building Overview
    https://docs.opendatakit.org/odk-x/build-app/?highlight=framework#building-an-application
-   Form Design
    https://docs.opendatakit.org/odk-x/xlsx-converter-intro/
-   UI Design
    https://docs.opendatakit.org/odk-x/tables-web-pages/

## PreRequisites

-   Install Node
-   Download or clone this repo

## Installation

Install dependencies

```
npm install
```

Start server (grunt task runner)

```
grunt
```

## Adding tables and forms

Each survey form must be placed within a table parent directory.
A new table can be created using the following command

```
grunt addtable:tableId
```

This will generated placeholder folders and odk-tables view templates. From here two more files must be generated and processed:

### {formName}.xlsx

This will be placed at `app/config/tables/{tableID}/forms/{formName}/{formname.xlsx}` (note, folder name must match form name). The file defines the form questions and metadata. An example is provided in the `app/config/_examples` folder, and should be modified to ensure the correct `tableId` is specified as above.

More info at: https://docs.opendatakit.org/odk-x/build-app/#creating-an-xlsx-form

_CC Note_ - Currently it appears that every table needs at least one form with the same
name as the table itself (tbc)

### framework.xlsx

This will be placed in the the `app/config/assets/framework/forms` folder and defines the full list of forms available to the app (so if it already exists will only require modification).
An example is provided in the `app/config/_examples` folder.

More info at: https://docs.opendatakit.org/odk-x/build-app/#creating-framework-xlsx

To process these (and any other) xlsx files run

```
grunt xlsx-convert-all
```

## Testing on device

Forms can be fully viewed from the application designer, however the odk-tables interface is not directly viewable.

The easiest way to preview the full application is by copying it onto an android device
running the odk tables application. This can be done manually via copy-paste (the entire app contents into the `sdcard/opendatakit/default` folder), or if configured for `adb` then executing `grunt adbpush`

Alternatively, html files can be previewed locally using a local webserver (e.g. http-server, xampp, python simple server), however any functionality that depends on database interactions is unlikely to work.

---

ODK Application Designer Docs  
v2.1.6

This repository contains the ODK-X Application Designer software.

Complete Android apps, including data entry, synchronization, and distribution,
can be written using HTML and JavaScript files. ODK-X Tables and ODK-X Survey will
serve these files as the skin of your app.

Projects intending to write a Tables app can clone this repository and use it
as a starting point.

Much of the boilerplate of app creation can be avoided by employing the Grunt
tasks specified in the Gruntfile.

For a more complete description of how to use this repository, please see our
user documentation at:

https://docs.opendatakit.org/odk-x/app-designer-intro/

Requires NodeJS 12 or higher.

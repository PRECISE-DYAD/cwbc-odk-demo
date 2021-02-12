# CWBC ODK Demo

This is a monorepo extension of ODK application designer. It contains the following folders:

| Folder        | Description                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| designer      | ODK-X app designer copy. Files are automatically copied here, and should not be modified directly                  |
| documentation | Various pieces of user documentation to help with specific features                                                |
| forms         | Table, form, csv and template data used with ODK-X. See the [forms readme](./forms/readme.md) for more information |
| frontend      | Custom frontend application built in angular to be viewed in ODK Tables. See development documentation notes below |
| scripts       | Custom scripts to manage build, deploy to mobile, server upload and data export operations                         |

## Prerequisites

- Node  
  https://nodejs.org/en/download/

- Yarn package manager
  ```
  npm i -g yarn
  ``
  ```

## Installation

```
yarn install
```

Note, this will automatically be run when using the start scripts below.

## Development

```
npm run start
```

This will automatically start the live server for the angular frontend, the live server for odkx application designer, and watch scripts to livereload changes to either.

### Frontend

To make changes to the frontend code see the documentation in [frontend readme](./frontend/README.md), and specific notes for the precise implementation in the [precise forms documentation](./documentation/precise-forms.md)

### Forms

To make changes to odk forms, use the `forms` directory to handle table, form, csv and template files. See the [forms readme](./forms/readme.md) for more information

## Building

```
npm run build
```

This will trigger build scripts to build the frontend, copy frontend and forms to the application designer, and run scripts to process forms for use within the ODK app.

## Deploy

```
npm run deploy
```

Once build the application can be pushed to a mobile device for testing with ODK Tables. This requires `adb` to be installed and an android device connected with ODK Tables, Survey and Sync applciations installed.

## Upload

Additional scripts also exist to handle direct upload to a server. See the [server-upload documentation](./documentation/server-upload.md) for more information.

## Export

Data can also be exported from the server to csv via:

```
npm run export
```

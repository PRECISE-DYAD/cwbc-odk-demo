# CWBC ODK Demo

This is a monorepo extension of ODK application designer. It contains a custom frontend application build in svelte, which compiles and is loaded into application designer as a custom ODK Tables interface.

An additional forms folder is used to simplify the process of adding and updating forms within the designer, and a set of scripts to facilitate.

## Prerequisites

- Node  
  https://nodejs.org/en/download/

## Installation

```
npm install
```

This will install core dependencies, and trigger the `postinstall` script which installs dependencies of the child application designer and frontend directories.

## Development

```
npm run start
```

This will present options to run start scripts for either the frontend or designer folders, bypassed by providing as an argument, i.e. `npm run start frontend`.

### Frontend

### App designer

## Build

```
npm run build
```

This will trigger build scripts to build the frontend, copy frontend and forms to the application designer, and run scripts to process forms for use within the ODK app.

## Deploy

```
npm run deploy
```

Once build the application can be pushed to a mobile device for testing with ODK Tables. This requires `adb` to be installed and an android device connected with ODK Tables, Survey and Sync applciations installed.

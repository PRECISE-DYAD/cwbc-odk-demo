# Designer Overrides

Where possible any updates to the core app-designer have been avoided, with scripts used to populate config and files dynamically on build.

It is intended that the app can work with a clean install of app designer, and retain good compatibility with future updates.

Known exceptions which may need to be migrated in the future are documented here.

## Removing sample materials

The default designer comes with lots of additional files and materials. These have been cleared out (manually, however there appears to be a `grunt empty` task to do similar)

## Local Development Cross-communication

When developing locally via `npm run start` two different apps run in parallel:

1. ODK Application Designer (localhost:8000)
2. Frontend app (localhost:4200)

When running on a device the frontend app has full access to odktables and odksurvey js environments exposed within the ODK Table parent app, which link via a java interface to the main database. When developing locally, however, this is not the case. There is no java interface and so ODK application designer instead introduces it's own mocking tools (such as using a web sql database in the browser)

To access this database, and any other functionality of odk survey or tables the designer app on port 8000 is embedded in an iframe within the frontend app on port 4200 (see [frontend/src/app/components/odk/odk.surveyIframe.ts](../frontend/src/app/components/odk/odk.surveyIframe.ts)

To enable the parent frontend app and child application designer iframes to communicate an additional step is required to allow what would be considered cross-origin requests between iframes (origin includes the port). This is handled in [designer/app/system/js/mock/cwbcCustomBindings.js](../designer/app/system/js/mock/cwbcCustomBindings.js) and included in `main.js` and `js/mock/odkDataIf.js` for importing

```
define([...'cwbcCustomBindings']
```

_designer/app/system/survey/js/mock/odkDataIf.js_

```
requirejs.config({
    [...]
    paths: {
        [...]
        cwbcCustomBindings:'js/mock/cwbcCustomBindings',
```

_designer/app/survey/js/main.js_

**NOTE** - these changes are only included when running locally (devices import their own designer system folder and cannot be modified)

## Local Development - File Cors

In addition to access database methods, extra steps have to be taken to directly access files from the designer survey as is done when running on device. A minimal implementation can be included in the top line of the `middlewares` configuration in [designer/gruntfile.js](/designer/Gruntfile.js)

```
var useCors = function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    next();
};

...

 middleware: function(connect) {
                        return [
                            useCors,
                            ...
                        ];
```

## Local Development - Date types

The local table doesn't have methods to import date columns (as string), so add to conversion mappings

```
else if ( f.type === "date" ) {
            createTableCmd += "TEXT" + (f.isNotNullable ? " NOT NULL" : " NULL");
```

_designer/app/system/js/mock/mockSchema.js_ `createTableStmt`

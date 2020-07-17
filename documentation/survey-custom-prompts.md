# ODK Survey Custom Prompts

There are 2 ways to extend on the default prompts and functionality offered within ODK Survey.

## 1. Custom Templates
These take an existing prompt type (e.g. `select_one`, `note`, `integer` etc.) and use a custom `.handlebars` (html/js) template to display how they look.

Custom templates should be based on existing templates found in the [ODK Survey JS Templates](../designer/app/system/survey/templates) folder, as often specific variable and class names are used to control data validation and value sync.

Documentation for working with handlebars templates can be found at https://handlebarsjs.com/, and additional examples with comments can be found in the [Form Templates](../forms/templates) folder.

All templates populated in the form templates folder will automatically be copied to the app assets folder, and can be used in a survey by specifying the `templatePath` column to the template (e.g. `../../../../assets/templates/custom_template.handlebars`)

See https://docs.odk-x.org/xlsx-converter-reference/#custom-prompt-types for more information about using in a form.


## 2. Custom Prompt Types
These further extend functionality by fully exposing all javascript method used when generating and validating prompts. 

Similar to templates, these start with a base prompt to extend on, viewable in the [prompte.js](../designer/app/system/survey/js/prompts.js) file of ODK survey.

Each form requires a `customPromptTypes.js` file to register prompts, however the file defined in `forms/templates/customPromptTypes.js` is automatically copied to all form folders for convenience.

To use a prompt within a survey do the following with the form `.xlsx` file:
1. Add a `custom_prompts` tab where the name of the prompt and data return type are specified.

2. Specify the prompt name in the `type` column of the `survey` sheet.

See the [Example Table](../forms/tables/exampleTable/forms/exampleTable/exampleTable.xlsx) and customPromptTypes.js in the `forms/templates` folder for more examples.
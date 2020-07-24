/**
 * Custom imports extend default prompt type functionality. They are useful for cases where data needs to be
 * modified before or after it is made available to the template. See all odk examples in designer/app/system/survey/js/prompts.js
 *
 * They can also be defined at a framework level to be made generally available
 *
 * NOTE: These will automatically be copied
 */

// define any js imports required. Note, only preconfigured system imports are available
define(["promptTypes", "jquery"], function (promptTypes, $) {
  return {
    // key should match the name defined in the prompt_types sheet
    // value should use a base type to extend on, e.g. input_type, select_one etc.
    // see full list in designer/app/system/survey/js/prompts.js
    example_custom_prompt: promptTypes.input_type.extend({
      // optional, provide a path to a handlebars template to use (default uses same as base prompt type)
      templatePath:
        "../config/assets/templates/example_custom_prompt.handlebars",
      afterRender: function () {
        // any of the default functions can be overwritten, afterRender is an empty placeholder
        // for making data changes after data full loaded and element rendered, so a good place for
        // updating via jquery or similar
      },
    }),
    custom_warning: promptTypes.note.extend({
      templatePath: "../config/assets/templates/custom_warning.handlebars",
    }),
    // numeric input with soft validation checks
    custom_number: promptTypes.input_type.extend({
      _baseInputAttributes: {
        type: "number",
      },
      templatePath: "../config/assets/templates/custom_number.handlebars",
      // validation checks happen in beforeMove. Skip these
      beforeMove: function () {
        return null;
      },
    }),
    custom_text: promptTypes.input_type.extend({
      _baseInputAttributes: {
        type: "text",
      },
      templatePath: "../config/assets/templates/custom_text.handlebars",
    }),
    custom_contents_page: promptTypes.user_branch.extend({
      templatePath:
        "../config/assets/templates/custom_contents_page.handlebars",
    }),
    custom_section_complete: promptTypes.acknowledge.extend({
      acknLabel: { text: "Mark Section as Complete" },
    }),
  };
});

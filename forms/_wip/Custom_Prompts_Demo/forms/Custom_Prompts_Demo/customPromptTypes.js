define(["promptTypes", "jquery"], function (promptTypes, $) {
  return {
    /*************************************************************************************************
     * E.g. Select autocomplete prompt type
     * use jquery-ui to provide an autocomplete search list to an input box with select options
     * NOTE - does not work as requires jquery-ui which is not available to survey (would require custom survey build)
     ************************************************************************************************* */
    custom_select_autocomplete_jquery: promptTypes.input_type.extend({
      afterRender: function () {
        try {
          const promptId = this.getPromptId();
          const name = this.renderContext.name;
          const columns = this.renderContext.metadata.kvMap.Column;
          const choices = columns[name]._displayChoicesList;
          const autocompleteOptions = choices.map(function (c) {
            return {
              value: c.data_value,
              label: c.display.title.text,
            };
          });
          // NOTE - requires jqueryUI lib import in app/system/survey/js/main.js
          $("#slider-" + promptId).autocomplete({
            source: autocompleteOptions,
          });
        } catch (error) {
          console.error(error);
        }
      },
    }),
  };
});

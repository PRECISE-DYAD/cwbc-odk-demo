define(["screenTypes"], function (screenTypes) {
  /**
   * Extend the standard ODK screen that renders all child prompts with modified
   * afterRender function to apply timeout to fix bug where sometimes scroll position
   * would not update correctly and just scroll to the top on more complex pages
   * NOTE: Code mostly copied from `screens.js`
   */
  screenTypes.custom_prompts_screen = screenTypes.screen.extend({
    afterRender: function () {
      var that = this;
      var setFocus = false;

      console.log("custom_log afterRender", this);
      $.each(that.activePrompts, function (idx, prompt) {
        prompt.afterRender();
        const { renderContext } = prompt;
        const fieldName = renderContext.name;
        // Add a data attribute to parent container to specify if
        // field has data or not. This is styled in custom css
        if (fieldName) {
          const fieldValue = renderContext.data[fieldName];
          // use string for property to make easier to style
          prompt.$el.attr("data-hasValue", fieldValue ? "true" : "false");
          prompt.$el.addClass("custom-screen-prompt");
        }
      });
      // Handle focus of next element
      if (
        that.$focusPromptTest !== null &&
        that.$focusPromptTest !== undefined
      ) {
        var focusElementAttr = {
          id: that.$focusPromptTest.attr("id"),
          value: that.$focusPromptTest.attr("value"),
          name: that.$focusPromptTest.attr("name"),
        };

        var focusElementString = that.$focusPromptTest
          .get(0)
          .tagName.toLowerCase();
        for (var key in focusElementAttr) {
          if (focusElementAttr[key]) {
            focusElementString =
              focusElementString +
              "[" +
              key +
              "='" +
              focusElementAttr[key] +
              "']";
            setFocus = true;
          }
        }

        if (setFocus === true) {
          odkCommon.log(
            "D",
            "screens.afterRender: focusElementString = " + focusElementString
          );
          $(focusElementString).focus();
        }
      }
      // Handle scroll position
      if (that.focusScrollPos) {
        // use a timeout as sometimes the scroll gets interrupted if also handling recursive delegated events
        setTimeout(() => {
          $(window).scrollTop(that.focusScrollPos);
        }, 0);
      }
    },
  });
});

define(["screenTypes", "require"], function (screenTypes, r) {
  /**
   * Extend the standard ODK screen with following functionality:
   *
   * - renders all child prompts with modified afterRender function to apply timeout to
   * fix bug where sometimes scroll position would not update correctly and just scroll to the top on more complex pages
   *
   * - Add custom data-attribute and classes for visual display of which inputs have values on a page
   *
   * - Attach a custom calculate object which contains calculations parsed from `customCalculations.js`
   *
   * NOTE: Code mostly copied from `screens.js`
   */

  loadCustomCalculationJS(r).then((custom_calculations) => {
    screenTypes.custom_prompts_screen = screenTypes.screen.extend({
      // attach custom calculation statements to prompts when retrieving
      buildRenderContext: function (ctxt) {
        var that = this;
        buildRenderContextWithCustomCalculations.apply(that, [ctxt, custom_calculations]);
      },
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
            // check specifically for blank strings and undefined as indication of value set
            const hasValue = [null, undefined, ""].indexOf(fieldValue) === -1;
            prompt.$el.attr("data-hasValue", hasValue);
            prompt.$el.addClass("custom-screen-prompt");
          }
        });
        // Handle focus of next element
        if (that.$focusPromptTest !== null && that.$focusPromptTest !== undefined) {
          var focusElementAttr = {
            id: that.$focusPromptTest.attr("id"),
            value: that.$focusPromptTest.attr("value"),
            name: that.$focusPromptTest.attr("name"),
          };

          var focusElementString = that.$focusPromptTest.get(0).tagName.toLowerCase();
          for (var key in focusElementAttr) {
            if (focusElementAttr[key]) {
              focusElementString =
                focusElementString + "[" + key + "='" + focusElementAttr[key] + "']";
              setFocus = true;
            }
          }

          if (setFocus === true) {
            odkCommon.log("D", "screens.afterRender: focusElementString = " + focusElementString);
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
});

/**
 * Load local customCalculations.js file if exists
 * @param r - local instantiation of require.js
 */
function loadCustomCalculationJS(r) {
  return new Promise((resolve, reject) => {
    try {
      // use local require to asynchronously load the file
      r(["./customCalculations.js"], function (calculations) {
        if (calculations) {
          console.log("[custom calculations] - loaded", calculations);
        }
        resolve(calculations || {});
      });
    } catch (error) {
      console.log("[custom_calculations] - could not load");
      console.error(error);
      resolve({});
    }
  });
}

/**
 * Adapted from parent screens.js
 * When preparing the prompts for render, add custom calculations to calculates fields
 */
function buildRenderContextWithCustomCalculations(ctxt, custom_calculations = {}) {
  var that = this;
  console.log("building render context", that);
  // this once held the code to invoke with_next and with_next_validate actions
  that.whenTemplateIsReady(
    $.extend({}, ctxt, {
      success: function () {
        // determine the active prompts
        that.activePrompts = []; // clear all prompts...
        var activePromptIndices = [];
        if (that._operation && that._operation._screen_block) {
          activePromptIndices = that._operation._screen_block();
          var sectionPrompts = that.controller.getCurrentSectionPrompts();
          var ap = [];
          var i;
          for (i = 0; i < activePromptIndices.length; ++i) {
            var prompt = sectionPrompts[activePromptIndices[i]];
            if (prompt === null || prompt === undefined) {
              ctxt.log("E", "Error! unable to resolve prompt!");
              ctxt.failure({ message: "bad prompt index!" });
              return;
            }
            prompt._screen = that;

            ap.push(prompt);
          }
          that.activePrompts = ap;
        }
        // we now know what we are going to render.
        // work with the controller to ensure that all
        // intermediate state has been written to the
        // database before commencing the rendering
        that.controller.commitChanges(
          $.extend({}, ctxt, {
            success: function () {
              ctxt.log("D", "buildRenderContext.commitChanges.success");
              that.initializeRenderContext();
              that.configureRenderContext(ctxt);
              /*** CWBC custom code to add custom calculates ****/
              that.activePrompts = that.activePrompts.map((prompt) => {
                if (prompt.renderContext.calculates) {
                  prompt.renderContext.calculates.custom = custom_calculations;
                }
                return prompt;
              });
              /*** End of CWBC custom code ****/
            },
          })
        );
      },
    })
  );
}

define(["screenTypes"], function (screenTypes) {
  /**
   * Extend the standard ODK screen that renders all child prompts with modified
   * afterRender function to apply timeout to fix bug where sometimes scroll position
   * would not update correctly and just scroll to the top on more complex pages
   */
  screenTypes.custom_prompts_screen = screenTypes.screen.extend({
    afterRender: function () {
      var that = this;
      $.each(that.activePrompts, function (idx, prompt) {
        prompt.afterRender();
      });
      if (that.focusScrollPos) {
        // use a timeout as sometimes the scroll gets interrupted if also handling recursive delegated events
        setTimeout(() => {
          $(window).scrollTop(that.focusScrollPos);
        }, 0);
      }
    },
  });
});

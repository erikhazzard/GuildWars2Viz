var GW2VIZ,
  _this = this;

GW2VIZ = (function() {
  var app, init, util;
  app = {};
  init = function() {
    return true;
  };
  util = {
    capitalize: function(text) {
      return text.charAt(0).toUpperCase() + text.substring(1);
    }
  };
  return {
    init: init,
    util: util,
    visualizations: {}
  };
})();

window.GW2VIZ = GW2VIZ;

GW2VIZ.init = function() {
  GW2VIZ.visualizations.donutViz();
  return true;
};

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
    data: {},
    visualizations: {}
  };
})();

window.GW2VIZ = GW2VIZ;

GW2VIZ.init = function() {
  GW2VIZ.data = {
    gender: [
      {
        label: "Male",
        value: 63
      }, {
        label: "Female",
        value: 37
      }
    ],
    race: [
      {
        label: "Charr",
        value: 14.32
      }, {
        label: "Asura",
        value: 15.31
      }, {
        label: "Sylvari",
        value: 15.31
      }, {
        label: "Norn",
        value: 20.25
      }, {
        label: "Human",
        value: 34.81
      }
    ],
    profession: [
      {
        label: "Engineer",
        value: 10.21
      }, {
        label: "Mesmer",
        value: 10.21
      }, {
        label: "Necromancer",
        value: 11.31
      }, {
        label: "Guardian",
        value: 12.40
      }, {
        label: "Thief",
        value: 12.40
      }, {
        label: "Elementalist",
        value: 13.39
      }, {
        label: "Ranger",
        value: 14.49
      }, {
        label: "Warrior",
        value: 15.59
      }
    ],
    tradeskill: [
      {
        label: "Artificer",
        value: 8.2
      }, {
        label: "Armorsmith",
        value: 10.74
      }, {
        label: "Huntsman",
        value: 10.74
      }, {
        label: "Chef",
        value: 13.51
      }, {
        label: "Jeweler",
        value: 13.51
      }, {
        label: "Leatherworker",
        value: 13.51
      }, {
        label: "Tailor",
        value: 13.51
      }, {
        label: "Weaponsmith",
        value: 16.28
      }
    ]
  };
  GW2VIZ.visualizations.donutViz();
  GW2VIZ.visualizations.barViz();
  return true;
};

var _this = this;

GW2VIZ.visualizations.donutViz = function(params) {
  var createChart, data, filterSupport, height, svg, width;
  data = {
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
        label: "Asura",
        value: 15.31
      }, {
        label: "Charr",
        value: 14.32
      }, {
        label: "Human",
        value: 34.81
      }, {
        label: "Norn",
        value: 20.25
      }, {
        label: "Sylvari",
        value: 15.31
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
  svg = d3.select('#svg-el');
  width = svg.attr('width');
  height = svg.attr('height');
  filterSupport = Modernizr.svgfilters;
  createChart = function(options) {
    var arc, arcs, bgLabelModifier, chartGroup, chartType, edgeSlice, innerRadius, labelSize, pie, pieFill, radius, startTextOpacity, textGroup, usePiePattern;
    labelSize = options.labelSize;
    radius = options.radius;
    innerRadius = options.innerRadius || false;
    chartType = options.chartType;
    usePiePattern = options.usePiePattern;
    pieFill = options.pieFill;
    bgLabelModifier = 5;
    startTextOpacity = 0.2;
    d3.selectAll('.patternRace').attr({
      width: radius,
      height: radius
    });
    chartGroup = svg.append('svg:g').attr({
      id: chartType + "-donut",
      'class': 'chartGroup',
      transform: "translate(" + [width / 2, height / 2] + ")"
    }).data([data[chartType]]);
    arc = d3.svg.arc().outerRadius(radius);
    if (innerRadius) arc.innerRadius(innerRadius);
    pie = d3.layout.pie().value(function(d) {
      return d.value;
    });
    arcs = chartGroup.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", function(d, i) {
      return "slice slice" + i;
    });
    arcs.append("svg:path").attr("d", arc).style({
      fill: "#ffffff",
      stroke: "#707070",
      "stroke-width": 2
    });
    edgeSlice = arcs.append("svg:path").attr({
      d: arc,
      'class': function(d, i) {
        return 'edgeSlice' + i;
      }
    }).style({
      fill: "#ffffff",
      stroke: "#707070",
      "stroke-opacity": 0.6,
      filter: "url(#jaggedEdge)",
      "stroke-width": 1
    });
    arcs.append("svg:path").attr({
      d: arc,
      'class': function(d, i) {
        return 'slice' + i;
      }
    }).style({
      fill: function(d, i) {
        if (usePiePattern === true) {
          return "url(#" + chartType + d.data.label + "Gradient)";
        } else {
          return pieFill[i];
        }
      },
      stroke: "#343434",
      filter: "url(#waterColor1)",
      "stroke-width": 2,
      "stroke-opacity": 1
    });
    textGroup = arcs.append('svg:g').attr({
      'class': function(d, i) {
        return 'textGroup textGroup' + i;
      }
    }).style({
      opacity: startTextOpacity
    });
    textGroup.append("svg:text").attr({
      "transform": function(d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        return "translate(" + arc.centroid(d) + ")";
      },
      "class": "bgLabel",
      "text-anchor": "middle"
    }).style({
      fill: "#ababab",
      filter: "url(#waterColor2)",
      "font-size": labelSize + bgLabelModifier + "px",
      opacity: 0.7,
      "text-shadow": "0 0 1px #000000"
    }).text(function(d, i) {
      return data[chartType][i].label;
    });
    textGroup.append("svg:text").attr({
      "transform": function(d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        return "translate(" + arc.centroid(d) + ")";
      },
      "class": "label",
      "text-anchor": "middle"
    }).style({
      fill: "#ffffff",
      "font-weight": "bold",
      "font-size": labelSize + 'px',
      "text-shadow": "0 0 3px #000000, 0 0 9px #000000"
    }).text(function(d, i) {
      return data[chartType][i].label;
    });
    textGroup.append("svg:text").attr({
      "class": "label",
      "transform": function(d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        return "translate(" + [arc.centroid(d)[0], arc.centroid(d)[1] + labelSize] + ")";
      },
      "text-anchor": "middle"
    }).style({
      fill: "#ffffff",
      "font-size": "1.1em",
      "text-shadow": "0 0 3px #000000"
    }).text(function(d, i) {
      return Math.round(data[chartType][i].value) + '%';
    });
    return arcs.on('mouseover', function(d, i) {
      chartGroup.select('.edgeSlice' + i).transition().duration(500).style({
        'stroke-width': 9,
        'stroke': '#000000',
        'stroke-opacity': 0.8
      });
      d3.selectAll('.textGroup').style({
        opacity: startTextOpacity
      });
      chartGroup.selectAll('.textGroup').style({
        opacity: 0.9
      });
      chartGroup.selectAll('.textGroup' + i).style({
        opacity: 1
      });
      chartGroup.selectAll('.textGroup' + i + ' .label').style({
        'font-size': labelSize + 5
      });
      chartGroup.selectAll('.textGroup' + i + ' .bgLabel').style({
        'font-size': labelSize + bgLabelModifier + 5
      });
      return chartGroup.selectAll('.textGroup' + i + ' .bgLabel').attr({
        transform: function(d, i) {
          return "translate(" + arc.centroid(d) + ") rotate(" + (18 + (i * 3)) + ")";
        }
      });
    }).on('mouseout', function(d, i) {
      chartGroup.select('.edgeSlice' + i).transition().duration(500).style({
        'stroke-width': 1,
        'stroke': '#707070',
        'stroke-opacity': 0.6
      });
      chartGroup.selectAll('.textGroup .label').style({
        'font-size': labelSize
      });
      chartGroup.selectAll('.textGroup' + i + ' .bgLabel').attr({
        transform: function(d, i) {
          return "translate(" + arc.centroid(d) + ") rotate(0)";
        }
      });
      chartGroup.selectAll('.textGroup' + i + ' .bgLabel').style({
        'font-size': labelSize + bgLabelModifier
      });
      return chartGroup.selectAll('.textGroup').style({
        opacity: startTextOpacity
      });
    });
  };
  createChart({
    labelSize: 14,
    radius: 68,
    chartType: 'gender',
    usePiePattern: true
  });
  createChart({
    labelSize: 17,
    radius: 160,
    innerRadius: 70,
    chartType: 'race',
    usePiePattern: true
  });
  createChart({
    labelSize: 16,
    radius: 264,
    innerRadius: 162,
    chartType: 'profession',
    usePiePattern: true
  });
  return createChart({
    labelSize: 17,
    radius: 320,
    innerRadius: 266,
    chartType: 'tradeskill',
    usePiePattern: true
  });
};

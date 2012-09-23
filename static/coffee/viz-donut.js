var _this = this;

GW2VIZ.visualizations.donutViz = function(params) {
  var baseScaleAmount, createChart, data, documentHeight, documentWidth, donutGroup, height, qualityLevel, scaleAmount, svg, width;
  data = GW2VIZ.data;
  svg = d3.select('#svg-el-donut');
  baseScaleAmount = 0.94;
  documentWidth = $(document).width();
  documentHeight = $(document).height();
  scaleAmount = documentWidth / 1380;
  if (scaleAmount > baseScaleAmount) scaleAmount = baseScaleAmount;
  donutGroup = svg.append('svg:g').attr({
    id: 'donutGroup',
    transform: "translate(" + [0, 20] + ") scale(" + scaleAmount + ")"
  });
  width = svg.attr('width');
  height = svg.attr('height');
  if (documentWidth < 1200) {
    svg.attr({
      width: documentWidth - parseInt($('#right-content').width(), 10)
    });
  }
  qualityLevel = GW2VIZ.qualityLevel;
  createChart = function(options) {
    var allLabels, allTextGroups, arc, arcs, bgLabelModifier, callback, chartGroup, chartType, edgeSlice, filteredSlice, iconGroup, imageSize, innerRadius, labelSize, pie, pieFill, radius, startingIconOpacity, startingTextOpacity, textGroup, thisTextGroup, usePiePattern;
    labelSize = options.labelSize;
    radius = options.radius;
    innerRadius = options.innerRadius || false;
    chartType = options.chartType;
    usePiePattern = options.usePiePattern;
    pieFill = options.pieFill;
    callback = options.callback;
    bgLabelModifier = 5;
    startingTextOpacity = 0;
    startingIconOpacity = 0.6;
    d3.selectAll('.patternRace').attr({
      width: radius,
      height: radius
    });
    chartGroup = donutGroup.append('svg:g').attr({
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
    filteredSlice = arcs.append("svg:path").attr("d", arc).style({
      fill: "#ffffff",
      stroke: "#505050",
      filter: function() {
        if (qualityLevel < 2) {
          return '';
        } else {
          return "url(#waterColor2)";
        }
      },
      "stroke-width": 4
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
      filter: function() {
        if (qualityLevel < 1) {
          return '';
        } else {
          return "url(#jaggedEdge)";
        }
      },
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
      filter: function() {
        if (qualityLevel < 1) {
          return '';
        } else {
          return "url(#waterColor1)";
        }
      },
      "stroke-width": 2,
      "stroke-opacity": 1
    });
    iconGroup = arcs.append('svg:g').attr({
      'class': function(d, i) {
        return 'iconGroup iconGroup' + i;
      }
    }).style({
      opacity: startingIconOpacity
    });
    imageSize = {
      height: 54,
      width: 54
    };
    iconGroup.append("svg:image").attr({
      "xlink:href": function(d, i) {
        return "/static/img/viz/" + d.data.label + ".png";
      },
      x: function(d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        return arc.centroid(d)[0] - (imageSize.width / 2);
      },
      y: function(d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        return arc.centroid(d)[1] - (imageSize.height / 2);
      },
      width: imageSize.width + 'px',
      height: imageSize.height + 'px'
    });
    textGroup = arcs.append('svg:g').attr({
      'class': function(d, i) {
        return 'textGroup textGroup' + i;
      }
    }).style({
      opacity: startingTextOpacity
    });
    textGroup.append("svg:text").attr({
      "transform": function(d, i) {
        var x, y;
        d.innerRadius = 0;
        d.outerRadius = radius;
        x = arc.centroid(d)[0];
        y = arc.centroid(d)[1];
        if (d.data.label.length === 'Necromancer') x += 8;
        return "translate(" + [x, y] + ")";
      },
      "class": "bgLabel",
      "text-anchor": "middle"
    }).style({
      fill: "#ababab",
      filter: function() {
        if (qualityLevel < 2) {
          return '';
        } else {
          return "url(#waterColor2)";
        }
      },
      "font-size": labelSize + bgLabelModifier + "px",
      opacity: 0.7,
      "text-shadow": "0 0 1px #000000"
    }).text(function(d, i) {
      return d.data.label;
    });
    textGroup.append("svg:text").attr({
      "transform": function(d, i) {
        var x, y;
        d.innerRadius = 0;
        d.outerRadius = radius;
        x = arc.centroid(d)[0];
        y = arc.centroid(d)[1];
        if (d.data.label === 'Necromancer') x += 14;
        return "translate(" + [x, y] + ")";
      },
      "class": "label",
      "text-anchor": "middle"
    }).style({
      fill: "#ffffff",
      "font-weight": "bold",
      "font-size": labelSize + 'px',
      "text-shadow": "0 0 3px #000000, 0 0 18px #000000"
    }).text(function(d, i) {
      return d.data.label;
    });
    textGroup.append("svg:text").attr({
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
      return Math.round(d.data.value) + '%';
    });
    allTextGroups = d3.selectAll('.textGroup');
    thisTextGroup = chartGroup.selectAll('.textGroup');
    allLabels = chartGroup.selectAll('.textGroup .label');
    if (qualityLevel > 1) {
      arcs.on('mouseover', function(d, i) {
        var curGroup;
        if (qualityLevel > 1) {
          chartGroup.select('.edgeSlice' + i).style({
            'stroke-width': 9,
            'stroke': '#000000',
            'stroke-opacity': 0.8
          });
        } else {
          chartGroup.select('.edgeSlice' + i).style({
            'stroke-width': 9,
            'stroke': '#000000',
            'stroke-opacity': 1
          });
        }
        allTextGroups.style({
          opacity: startingTextOpacity
        });
        thisTextGroup.style({
          opacity: 0.9
        });
        curGroup = chartGroup.selectAll('.textGroup' + i);
        curGroup.style({
          opacity: 1
        });
        curGroup.selectAll('.label').style({
          'font-size': labelSize + 6
        });
        curGroup.selectAll('.bgLabel').style({
          'font-size': labelSize + bgLabelModifier + 6
        }).attr({
          transform: function(d, i) {
            return "translate(" + arc.centroid(d) + ") rotate(" + (18 + (i * 3)) + ")";
          }
        });
        if (qualityLevel > 1) {
          iconGroup.style({
            opacity: 0.3
          });
        }
        if (chartType !== 'gender') {
          return GW2VIZ.visualizations.barHighlightOver({
            chartType: chartType,
            d: d,
            i: i
          });
        }
      }).on('mouseout', function(d, i) {
        if (qualityLevel > 1) {
          chartGroup.select('.edgeSlice' + i).style({
            'stroke-width': 1,
            'stroke': '#707070',
            'stroke-opacity': 0.6
          });
        } else {
          chartGroup.select('.edgeSlice' + i).transition().duration(300).style({
            'stroke-width': 1,
            'stroke': '#707070',
            'stroke-opacity': 0.6
          });
        }
        allLabels.style({
          'font-size': labelSize
        });
        chartGroup.selectAll('.textGroup' + i + ' .bgLabel').attr({
          transform: function(d, i) {
            return "translate(" + arc.centroid(d) + ") rotate(0)";
          }
        }).style({
          'font-size': labelSize + bgLabelModifier
        });
        thisTextGroup.style({
          opacity: startingTextOpacity
        });
        if (qualityLevel > 1) {
          iconGroup.style({
            opacity: startingIconOpacity
          });
        }
        if (chartType !== 'gender') {
          return GW2VIZ.visualizations.barHighlightOut({
            chartType: chartType,
            d: d,
            i: i
          });
        }
      });
    }
    if (callback) return callback();
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
    radius: 270,
    innerRadius: 162,
    chartType: 'profession',
    usePiePattern: true
  });
  return createChart({
    labelSize: 17,
    radius: 350,
    innerRadius: 272,
    chartType: 'tradeskill',
    usePiePattern: true,
    callback: function() {
      return $('#loading').css({
        opacity: 0,
        display: 'none'
      });
    }
  });
};

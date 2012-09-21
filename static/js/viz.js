(function() {
  var _this = this;

  GW2VIZ.visualizations.classes = function(params) {
    var DATA, barGroupWidth, barLabels, barPadding, barRadius, barStartLeft, chartGroup, dataBarGroups, dataBars, dataMax, height, padding, svg, tickYScale, width, xScale, yAxisGroup, yAxisTicks, yScale;
    svg = d3.select('#svg-el-class-viz');
    width = svg.attr('width');
    height = svg.attr('height');
    yAxisGroup = svg.append('svg:g').attr({
      'class': 'axisGroup'
    });
    chartGroup = svg.append('svg:g').attr({
      'class': 'barWrapper'
    });
    DATA = [
      {
        name: 'Engineer',
        value: 10.2,
        color: "#d94d4c"
      }, {
        name: 'Theif',
        value: 12.5,
        color: "#d9824d"
      }, {
        name: 'Elementalist',
        value: 13.3,
        color: "#eda338"
      }, {
        name: 'Guardian',
        value: 15.5,
        color: "#a6a638"
      }, {
        name: 'Mesmer',
        value: 10.2,
        color: "#86a965"
      }, {
        name: 'Ranger',
        value: 14.4,
        color: "#68c7ff"
      }, {
        name: 'Warrior',
        value: 11.5,
        color: "#4ab3d1"
      }, {
        name: 'Necromancer',
        value: 12.5,
        color: "#87abab"
      }
    ];
    padding = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 34
    };
    barGroupWidth = width - padding.left - padding.right;
    barPadding = 2;
    barRadius = 3;
    barStartLeft = 10;
    dataMax = _.max(DATA, function(datum) {
      return datum.value;
    }).value;
    dataMax += 4;
    xScale = d3.scale.linear().range([padding.left + barStartLeft, width]).domain([0, DATA.length]);
    yScale = d3.scale.linear().range([0, height - padding.top - padding.bottom]).domain([0, dataMax]);
    dataBarGroups = chartGroup.selectAll('g.chartBars').data(DATA);
    dataBarGroups.enter().append('svg:g').attr({
      'class': 'chartBars'
    });
    dataBarGroups.exit().remove();
    dataBars = dataBarGroups.selectAll('rect.bar').data(DATA);
    dataBars.enter().append('svg:rect').attr({
      'class': 'bar',
      width: (barGroupWidth / DATA.length) - barPadding,
      x: function(d, i) {
        return xScale(i);
      },
      height: function(d, i) {
        return 0;
      },
      y: function(d, y) {
        return height - padding.top - padding.bottom;
      },
      rx: barRadius
    }).style({
      fill: function(d, i) {
        return d.color;
      }
    });
    dataBars.exit().remove();
    dataBars.transition().duration(500).ease('linear').attr({
      height: function(d, i) {
        return yScale(d.value);
      },
      y: function(d, y) {
        return height - yScale(d.value) - padding.bottom - padding.top;
      }
    });
    barLabels = dataBarGroups.selectAll('text').data(DATA);
    barLabels.enter().append('svg:text').attr({
      x: function(d, i) {
        return xScale(i) + 6;
      },
      y: height - padding.bottom - padding.top - 3
    }).style({
      'font-size': '.6em',
      fill: '#f0f0f0',
      'text-shadow': '0 1px 1px #000000'
    }).text(function(d, i) {
      return d.value + '%';
    });
    tickYScale = d3.scale.linear().range([0, height - padding.top - padding.bottom]).domain([dataMax, 0]);
    yAxisTicks = d3.svg.axis().scale(tickYScale).ticks(5).orient("left").tickSize(-width);
    yAxisGroup.attr("transform", "translate(" + [padding.left, 0] + ")").classed("yaxis", true).call(yAxisTicks);
    yAxisGroup.selectAll("path").style("fill", "none").style("stroke", "#505050");
    yAxisGroup.selectAll("line").style("fill", "none").style("stroke", "#606060").style('stroke-width', 1).style("opacity", .4);
    return yAxisGroup.selectAll("text").style({
      fill: "#ababab",
      'font-size': '.6em',
      'text-shadow': '0 0 1px #000000'
    }).text(function(d, i) {
      return d + '%';
    });
  };

}).call(this);

(function() {
  var _this = this;

  GW2VIZ.visualizations.classes = function(params) {
    var DATA, barGroupWidth, barPadding, barRadius, barStartLeft, chartGroup, dataBars, dataMax, height, padding, svg, tickYScale, width, xScale, yAxisGroup, yAxisTicks, yScale;
    svg = d3.select('#svg-el-class-viz');
    width = svg.attr('width');
    height = svg.attr('height');
    yAxisGroup = svg.append('svg:g');
    chartGroup = svg.append('svg:g');
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
      bottom: 10,
      left: 34
    };
    barGroupWidth = width - padding.left - padding.right;
    barPadding = 2;
    barRadius = 2;
    barStartLeft = 10;
    dataMax = _.max(DATA, function(datum) {
      return datum.value;
    }).value;
    xScale = d3.scale.linear().range([padding.left + barStartLeft, width]).domain([0, DATA.length]);
    yScale = d3.scale.linear().range([0, height - padding.top]).domain([0, dataMax]);
    dataBars = chartGroup.selectAll('rect').data(DATA);
    dataBars.enter().append('svg:rect').attr({
      width: (barGroupWidth / DATA.length) - barPadding,
      x: function(d, i) {
        return xScale(i);
      },
      height: function(d, i) {
        return 7;
      },
      y: function(d, y) {
        return height;
      },
      rx: barRadius
    }).style({
      fill: function(d, i) {
        return d.color;
      }
    });
    dataBars.transition().duration(300).ease('linear').attr({
      height: function(d, i) {
        return yScale(d.value);
      },
      y: function(d, y) {
        return height - yScale(d.value);
      }
    });
    svg.append("line").attr({
      x1: padding.left - barPadding,
      x2: width - padding.right,
      y1: height - .5,
      y2: height - .5
    }).style("stroke", "#232323");
    tickYScale = d3.scale.linear().range([0, height]).domain([dataMax, 0]);
    yAxisTicks = d3.svg.axis().scale(tickYScale).ticks(10).orient("left").tickSize(-width);
    yAxisGroup.attr("transform", "translate(" + [padding.left, 0] + ")").classed("yaxis", true).call(yAxisTicks);
    yAxisGroup.selectAll("path").style("fill", "none").style("stroke", "#000000");
    return yAxisGroup.selectAll("line").style("fill", "none").style("stroke", "#404040").style('stroke-width', 1).style("opacity", .4);
  };

}).call(this);

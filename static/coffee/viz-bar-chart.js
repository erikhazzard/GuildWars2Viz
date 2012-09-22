var _this = this;

GW2VIZ.visualizations.barViz = function(params) {
  var createChart;
  createChart = GW2VIZ.visualizations.createChart;
  createChart({
    chartType: 'profession'
  });
  createChart({
    chartType: 'tradeskill'
  });
  return createChart({
    chartType: 'race'
  });
};

GW2VIZ.visualizations.createChart = function(params) {
  var barGroupWidth, barLabels, barPadding, barRadius, barStartLeft, chartGroup, chartType, colors, data, dataBarGroups, dataBars, dataMax, height, padding, svg, tickYScale, width, xScale, yAxisGroup, yAxisTicks, yScale;
  chartType = params.chartType;
  colors = {
    Human: '#a51d11',
    Norn: '#5dbbb0',
    Asura: '#6b97c0',
    Sylvari: '#6e8d4a',
    Charr: '#9a6d57'
  };
  svg = d3.select('#svg-el-' + chartType);
  width = svg.attr('width');
  height = svg.attr('height');
  yAxisGroup = svg.append('svg:g').attr({
    'class': 'axisGroup'
  });
  chartGroup = svg.append('svg:g').attr({
    'class': 'barWrapper'
  });
  data = GW2VIZ.data[chartType];
  padding = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 34
  };
  barGroupWidth = width - padding.left - padding.right;
  barPadding = 2;
  barRadius = 0;
  barStartLeft = 10;
  dataMax = _.max(data, function(datum) {
    return datum.value;
  }).value;
  dataMax += 4;
  xScale = d3.scale.linear().range([padding.left + barStartLeft, width]).domain([0, data.length]);
  yScale = d3.scale.linear().range([0, height - padding.top - padding.bottom]).domain([0, dataMax]);
  dataBarGroups = chartGroup.selectAll('g.chartBars').data(data);
  dataBarGroups.enter().append('svg:g').attr({
    'class': 'chartBars'
  });
  dataBarGroups.exit().remove();
  dataBars = dataBarGroups.selectAll('rect.bar').data(data);
  dataBars.enter().append('svg:rect').attr({
    'class': 'bar',
    width: (barGroupWidth / data.length) - barPadding,
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
    stroke: "#343434",
    fill: function(d, i) {
      return colors[data[i].label];
    }
  });
  dataBars.exit().remove();
  dataBars.attr({
    height: function(d, i) {
      return yScale(d.value);
    },
    y: function(d, y) {
      return height - yScale(d.value) - padding.bottom - padding.top;
    }
  });
  barLabels = dataBarGroups.selectAll('text').data(data);
  barLabels.enter().append('svg:text').attr({
    x: function(d, i) {
      return xScale(i) + 6;
    },
    y: height - padding.bottom - padding.top - 3
  }).style({
    'font-size': '.9em',
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
    fill: "#343434",
    'font-size': '.6em',
    'text-shadow': '0 0 1px #ffffff'
  }).text(function(d, i) {
    return d + '%';
  });
};

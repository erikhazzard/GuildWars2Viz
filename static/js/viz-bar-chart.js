(function() {
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
    var barGroupWidth, barLabels, barPadding, barRadius, barStartLeft, bars, chartGroup, chartType, colors, data, dataBarGroups, dataBars, dataMax, filteredBars, height, padding, svg, tickYScale, width, xScale, yAxisGroup, yAxisTicks, yScale;
    chartType = params.chartType;
    colors = {
      Human: '#a51d11',
      Norn: '#5dbbb0',
      Asura: '#6b97c0',
      Sylvari: '#6e8d4a',
      Charr: '#9a6d57',
      Ranger: '#7e8659',
      Elementalist: '#97bccf',
      Guardian: '#61b499',
      Thief: '#701e1e',
      Necromancer: '#0a3018',
      Engineer: '#625544',
      Mesmer: '#975b91',
      Warrior: '#e09056',
      Chef: '#527599',
      Jeweler: '#8e6695',
      Leatherworker: '#956d58',
      Tailor: '#a18e46',
      Armorsmith: '#8e8e8e',
      Huntsman: '#6e8b54',
      Artificer: '#6ebeac',
      Weaponsmith: '#b25252'
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
    barPadding = 8;
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
    bars = dataBars.enter().append('svg:g').attr({
      id: function(d, i) {
        return 'barWrapper-' + chartType + '-' + d.label;
      }
    });
    filteredBars = bars.append('svg:rect').attr({
      'class': function(d, i) {
        var posX, posY;
        posY = parseInt(height - (yScale(d.value) + 20) - padding.bottom - padding.top);
        if (posY < 1) posY = 1;
        posX = parseInt(xScale(i)) - 6;
        return 'barFilter posX' + posX + ' posY' + posY;
      },
      width: (barGroupWidth / data.length) + 8,
      x: function(d, i) {
        return -5000;
      },
      height: function(d, i) {
        return yScale(d.value) + 20;
      },
      y: function(d, y) {
        return -500;
      }
    }).style({
      stroke: "#343434",
      "stroke-width": 8,
      filter: 'url(#waterColor1)',
      opacity: 1.0,
      fill: function(d, i) {
        return "url(#" + chartType + data[i].label + 'Gradient)';
      }
    });
    bars.append('svg:rect').attr({
      'class': 'bar',
      'id': function(d, i) {
        return 'bar-' + chartType + '-' + d.label;
      },
      width: (barGroupWidth / data.length) - barPadding,
      x: function(d, i) {
        return xScale(i);
      },
      height: function(d, i) {
        return yScale(d.value);
      },
      y: function(d, y) {
        return height - yScale(d.value) - padding.bottom - padding.top;
      },
      rx: barRadius
    }).style({
      stroke: "#454545",
      'stroke-width': '3px',
      filter: "url(#jaggedEdge)",
      fill: function(d, i) {
        return "url(#" + chartType + data[i].label + 'Gradient)';
      }
    });
    bars.append('svg:rect').attr({
      'class': 'bar',
      'id': function(d, i) {
        return 'bar-' + chartType + '-' + d.label;
      },
      width: (barGroupWidth / data.length) - barPadding,
      x: function(d, i) {
        return xScale(i);
      },
      height: function(d, i) {
        return yScale(d.value);
      },
      y: function(d, y) {
        return height - yScale(d.value) - padding.bottom - padding.top;
      },
      rx: barRadius
    }).style({
      stroke: "#000000",
      'stroke-width': '1px',
      fill: 'none'
    });
    dataBars.exit().remove();
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

}).call(this);

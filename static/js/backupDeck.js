(function() {
  var _this = this;

  DECKVIZ.Deck.manaCurve = function(deck, originalDeck) {
    var calcCC, card, chart, completeDeck, cost, height, highestCardCount, manaCostArray, manaCostLookup, maxManaCost, mostNumOfCards, num, originalHeight, padding, svgEl, svgId, tickYScale, tmpDeck, width, xScale, yAxis, yAxisGroup, yScale, _i, _len;
    svgId = '#svg-el-deck-mana';
    $(svgId).empty();
    width = $(svgId).attr('width');
    height = $(svgId).attr('height');
    maxManaCost = 10;
    padding = [10, 0, 0, 50];
    calcCC = DECKVIZ.util.convertedManaCost;
    manaCostLookup = {};
    tmpDeck = [];
    for (_i = 0, _len = deck.length; _i < _len; _i++) {
      card = deck[_i];
      if (manaCostLookup[calcCC(card.manacost)]) {
        manaCostLookup[calcCC(card.manacost)] += 1;
      } else {
        manaCostLookup[calcCC(card.manacost)] = 1;
      }
      if (card.manacost) tmpDeck.push(card);
    }
    completeDeck = _.clone(deck);
    deck = tmpDeck;
    manaCostArray = [];
    mostNumOfCards = 0;
    for (cost in manaCostLookup) {
      num = manaCostLookup[cost];
      if ((cost != null) && parseInt(cost)) {
        manaCostArray.push([cost, num]);
        if (num > mostNumOfCards) mostNumOfCards = num;
      }
    }
    xScale = d3.scale.linear().domain([0, maxManaCost]).range([padding[3], width]);
    originalHeight = height;
    height = height - 100;
    highestCardCount = 20;
    if (mostNumOfCards > 20) highestCardCount = mostNumOfCards * 1.2;
    yScale = d3.scale.linear().domain([0, highestCardCount]).rangeRound([padding[0], height]);
    svgEl = d3.select(svgId);
    chart = svgEl.selectAll("rect").data(manaCostArray).enter();
    chart.append("rect").attr("x", function(d, i) {
      return xScale(d[0]) - .5;
    }).attr("width", function(d, i) {
      return width / (maxManaCost + 2);
    }).style("fill", function(d, i) {
      return DECKVIZ.util.colorScale['X'];
    }).attr("y", function(d) {
      return height;
    }).attr("height", function(d) {
      return 0;
    }).transition().attr('height', function(d) {
      return yScale(d[1]) - .5;
    }).attr('y', function(d) {
      return height - yScale(d[1]) - .5;
    });
    chart.append('text').text(function(d, i) {
      return d[1];
    }).attr("x", function(d, i) {
      return (xScale(d[0]) - 5) + ((width / (maxManaCost + 2)) / 2);
    }).attr("y", height - 15).style('fill', '#ffffff').style('text-shadow', '0 -1px 2px #000000');
    svgEl.selectAll("text.label").data((function() {
      var _results;
      _results = [];
      for (num = 0; 0 <= maxManaCost ? num <= maxManaCost : num >= maxManaCost; 0 <= maxManaCost ? num++ : num--) {
        _results.push(num);
      }
      return _results;
    })()).enter().append('svg:text').attr('class', 'label').attr("x", function(d, i) {
      return (xScale(d) - .5) + ((width / (maxManaCost + 2)) / 2);
    }).attr("y", height + 20).text(function(d, i) {
      return d;
    });
    svgEl.append("line").attr("x1", padding[3]).attr("x2", width).attr("y1", height - .5).attr("y2", height - .5).style("stroke", "#000");
    tickYScale = d3.scale.linear().domain([highestCardCount, 0]).rangeRound([padding[0], height]);
    yAxis = d3.svg.axis().scale(tickYScale).ticks(9).orient("left");
    yAxisGroup = svgEl.append("g").attr("transform", "translate(" + [padding[3], 0] + ")").classed("yaxis", true).call(yAxis);
    yAxisGroup.selectAll("path").style("fill", "none").style("stroke", "#000");
    yAxisGroup.selectAll("line").style("fill", "none").style("stroke", "#000");
    return true;
  };

}).call(this);

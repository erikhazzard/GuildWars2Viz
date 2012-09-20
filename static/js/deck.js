(function() {
  var _this = this;

  DECKVIZ.Deck.getDeckFromInput = function(params) {
    var cardName, cardText, deck, deckArray, deckText, numCards, _i, _len;
    if (!params) return false;
    params = params || {};
    if (params.el) deckText = el.val();
    if (params.deckText) deckText = params.deckText;
    if (!deckText) {
      deckText = '';
      deckArray = false;
    } else {
      deckArray = deckText.split('\n');
    }
    deck = {};
    if (deckArray) {
      for (_i = 0, _len = deckArray.length; _i < _len; _i++) {
        cardText = deckArray[_i];
        numCards = parseInt(cardText.replace(/[^0-9 ]/gi, ''), 10);
        cardName = cardText.replace(/[0-9]+ */gi, '');
        deck[cardName] = numCards;
      }
    }
    return deck;
  };

  DECKVIZ.Deck.getCardTypes = function(params) {
    var card, cardTypes, _i, _len, _ref;
    cardTypes = {};
    params = params || {};
    if (!params.deck) {
      console.log('No deck passed in!');
      return false;
    }
    _ref = params.deck;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      card = _ref[_i];
      if (cardTypes[card.type] != null) {
        cardTypes[card.type] += 1;
      } else {
        cardTypes[card.type] = 1;
      }
    }
    return cardTypes;
  };

  $('#deck').on('keyup', function(e) {
    return DECKVIZ.Deck.create(DECKVIZ.Deck.getDeckFromInput({
      deckText: $('#deck').val()
    }), true);
  });

  $('#deck').val('2 Pillar of Flame\n4 Huntmaster of the Fells\n2 Kessig Wolf Run\n1 Devil\'s Play\n1 Whipflare\n2 Green Sun\'s Zenith\n4 Sphere of the Suns\n3 Inkmoth Nexus\n4 Slagstorm\n1 Wurmcoil Engine\n2 Galvanic Blast\n4 Copperline Gorge\n4 Glimmerpost\n1 Inferno Titan\n4 Primeval Titan\n1 Acidic Slime\n4 Rootbound Crag\n3 Solemn Simulacrum\n4 Mountain\n5 Forest\n4 Rampant Growth\n1 Birds of Paradise');

  DECKVIZ.Deck.create = function(deck) {
    var cardName, deckCopy, deckText, finalDeck, num, url, urlArray;
    if (!deck) {
      deckText = $('#deck').val();
      deck = DECKVIZ.Deck.getDeckFromInput({
        deckText: deckText
      });
      deckCopy = DECKVIZ.Deck.getDeckFromInput({
        deckText: deckText
      });
    }
    urlArray = [];
    for (cardName in deck) {
      num = deck[cardName];
      urlArray.push('^' + cardName + '$');
    }
    url = '/items/name=' + urlArray.join('|');
    finalDeck = [];
    return $.ajax({
      url: url,
      success: function(res) {
        var card, cardTypes, i, _i, _len, _ref, _ref2;
        _ref = res.cards;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          card = _ref[_i];
          if (deck[card.name] > 0) {
            for (i = 0, _ref2 = deck[card.name] - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
              finalDeck.push(card);
            }
            deck[card.name] = -1;
          }
        }
        cardTypes = DECKVIZ.Deck.getCardTypes({
          deck: finalDeck
        });
        return DECKVIZ.Deck.drawManaCurve(finalDeck, deck);
      }
    });
  };

  DECKVIZ.Deck.drawManaCurve = function(deck, originalDeck) {
    var barSpacingFactor, barsGroup, calcCC, card, cardCost, cardType, colorCostArray, colorGroup, colorStackedData, colorlessCost, cost, curManaCost, height, highestCardCount, i, key, manaBars, manaBarsNumLabel, manaCostArray, manaCostLookup, manaCostLookupArray, manaCurveVizWrapper, maxManaCost, mostNumOfCards, num, padding, scaleBarWidth, svgDefs, svgEl, targetBars, tickYScale, tmpCost, val, value, width, xScale, yAxisGroup, yAxisHorizontalLines, yAxisTicks, yScale, _i, _len, _ref;
    svgEl = d3.select('#svg-el-deck-mana');
    $('#svg-defs').remove();
    svgDefs = svgEl.append("svg:defs").attr('id', 'svg-defs');
    width = svgEl.attr('width');
    height = svgEl.attr('height');
    height = height - 100;
    maxManaCost = 7;
    padding = [0, 0, 0, 50];
    calcCC = DECKVIZ.util.calculateCardManaCost;
    manaCostLookup = {};
    colorCostArray = [];
    scaleBarWidth = false;
    for (_i = 0, _len = deck.length; _i < _len; _i++) {
      card = deck[_i];
      cardCost = calcCC(card.manacost);
      if (manaCostLookup[cardCost]) {
        manaCostLookup[cardCost].total += 1;
      } else {
        manaCostLookup[cardCost] = {};
        manaCostLookup[cardCost].total = 1;
        if (cardCost > maxManaCost) maxManaCost = cardCost;
      }
      manaCostLookup[cardCost].cost = cardCost;
      if (!manaCostLookup[cardCost].type) manaCostLookup[cardCost].type = {};
      if (card.type) {
        cardType = card.type.split(' - ')[0];
        if (manaCostLookup[cardCost].type[cardType]) {
          manaCostLookup[cardCost].type[cardType] += 1;
        } else {
          manaCostLookup[cardCost].type[cardType] = 1;
        }
      }
      curManaCost = card.manacost;
      if (curManaCost) {
        colorlessCost = parseInt(curManaCost, 10);
        tmpCost = '';
        if (colorlessCost > 0) {
          for (i = 0, _ref = colorlessCost - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            tmpCost += 'C';
          }
        }
        colorlessCost = tmpCost;
        curManaCost = curManaCost.replace(/^[0-9]*/, '');
        curManaCost = colorlessCost + curManaCost;
        colorCostArray.push(curManaCost);
        if (!manaCostLookup[cardCost].color) manaCostLookup[cardCost].color = {};
        if (manaCostLookup[cardCost].color[curManaCost]) {
          manaCostLookup[cardCost].color[curManaCost] += 1;
        } else {
          manaCostLookup[cardCost].color[curManaCost] = 1;
        }
      }
    }
    manaCostLookupArray = [];
    for (key in manaCostLookup) {
      val = manaCostLookup[key];
      manaCostLookupArray.push(val);
    }
    colorCostArray = _.unique(colorCostArray);
    colorStackedData = d3.layout.stack()(colorCostArray.map(function(color) {
      var c, curColors, gradient, map, _j, _len2;
      gradient = svgDefs.append("svg:linearGradient").attr("id", "gradient-" + color);
      curColors = color.split('(');
      curColors = curColors[0].split('');
      i = 0;
      for (_j = 0, _len2 = curColors.length; _j < _len2; _j++) {
        c = curColors[_j];
        gradient.append("svg:stop").attr("offset", ((100 / curColors.length) * i) + '%').attr("stop-color", DECKVIZ.util.colorScale[c]).attr("stop-opacity", 1);
        gradient.append("svg:stop").attr("offset", ((100 / curColors.length) * (i + 1) - 2) + '%').attr("stop-color", DECKVIZ.util.colorScale[c]).attr("stop-opacity", 1);
        i++;
      }
      map = manaCostLookupArray.map(function(d) {
        var xValue, yValue;
        yValue = 0;
        if (d.color && d.color[color]) yValue = d.color[color];
        xValue = d.cost || -1;
        return {
          x: xValue,
          y: yValue,
          color: color
        };
      });
      return map;
    }));
    maxManaCost += 1;
    manaCostArray = [];
    mostNumOfCards = 0;
    for (cost in manaCostLookup) {
      value = manaCostLookup[cost];
      if ((cost != null) && parseInt(cost)) {
        manaCostArray.push([cost, value.total]);
        if (value.total > mostNumOfCards) mostNumOfCards = value.total;
      }
    }
    highestCardCount = 20;
    if (mostNumOfCards > 20) highestCardCount = mostNumOfCards * 1.15;
    xScale = d3.scale.linear().rangeRound([padding[3], width]).domain([0, maxManaCost]);
    yScale = d3.scale.linear().rangeRound([0, height]).domain([0, highestCardCount]);
    barsGroup = d3.select('#manaCurve');
    barSpacingFactor = 1.5;
    colorGroup = barsGroup.selectAll("g.color").data(colorStackedData);
    colorGroup.enter().append('svg:g').attr('class', 'color');
    colorGroup.exit().remove();
    manaBars = colorGroup.selectAll('rect.cardBar').data(function(d) {
      return d;
    });
    manaBars.enter().append('svg:rect').attr("x", function(d) {
      return xScale(d.x);
    }).attr("y", height).attr("height", 0).attr('class', 'cardBar').attr("width", width / (maxManaCost + barSpacingFactor));
    manaBars.exit().transition().duration(300).ease('circle').attr('y', height).attr('height', 0).remove();
    targetBars = manaBars.transition().duration(250).ease("quad").attr("x", function(d) {
      return xScale(d.x);
    }).attr("y", function(d) {
      return (height - yScale(d.y0)) - yScale(d.y);
    }).attr("height", function(d) {
      if (d.y < 1) {
        return 0;
      } else {
        return yScale(d.y);
      }
    }).attr("width", function(d) {
      return width / (maxManaCost + barSpacingFactor);
    });
    targetBars.style('stroke', '#000000').style('stroke-width', '1').style('stroke-opacity', .7);
    targetBars.style('fill', function(d) {
      return 'url(#gradient-' + d.color + ')';
    });
    manaBarsNumLabel = barsGroup.selectAll("text").data(manaCostArray);
    manaBarsNumLabel.enter().append("text").style("fill", '#000000').style('text-shadow', '0 0 1px #ffffff').style('opacity', .3).attr("x", function(d, i) {
      return (xScale(d[0]) - 5) + ((width / (maxManaCost + barSpacingFactor)) / 2);
    }).attr("y", function(d, i) {
      return height;
    });
    manaBarsNumLabel.exit().transition().duration(300).ease('circle').attr('y', height).attr('height', 0).text('0').remove();
    manaBarsNumLabel.transition().duration(250).ease("quad").text(function(d, i) {
      return d[1];
    }).attr("x", function(d, i) {
      return (xScale(d[0]) - 5) + ((width / (maxManaCost + barSpacingFactor)) / 2);
    }).attr("y", function(d, i) {
      return height - yScale(d[1]) - 5;
    });
    svgEl = d3.select('#axesLabels');
    $(svgEl.node()).empty();
    svgEl = svgEl.append('g').attr('class', 'axesGroup');
    svgEl.selectAll("text.label").data((function() {
      var _ref2, _results;
      _results = [];
      for (num = 0, _ref2 = maxManaCost - 1; 0 <= _ref2 ? num <= _ref2 : num >= _ref2; 0 <= _ref2 ? num++ : num--) {
        _results.push(num);
      }
      return _results;
    })()).enter().append('svg:text').attr('class', 'label').attr("x", function(d, i) {
      return (xScale(d) - .5) + ((width / (maxManaCost + barSpacingFactor)) / 2);
    }).attr("y", height + 20).text(function(d, i) {
      return d;
    });
    svgEl.append("line").attr("x1", padding[3]).attr("x2", width).attr("y1", height - .5).attr("y2", height - .5).style("stroke", "#000");
    tickYScale = d3.scale.linear().domain([highestCardCount, 0]).range([0, height]);
    yAxisTicks = d3.svg.axis().scale(tickYScale).ticks(10).orient("left").tickSize(-width);
    yAxisHorizontalLines = d3.svg.axis().scale(tickYScale).ticks(highestCardCount).orient("left").tickSize(-width);
    yAxisGroup = svgEl.append("g").attr("transform", "translate(" + [padding[3], 0] + ")").classed("yaxis", true).call(yAxisTicks);
    yAxisGroup.selectAll("path").style("fill", "none").style("stroke", "#000000");
    yAxisGroup.selectAll("line").style("fill", "none").style("stroke", "#404040").style('stroke-width', 1).style("opacity", .4);
    yAxisHorizontalLines = svgEl.append("g").attr("transform", "translate(" + [padding[3], 0] + ")").classed("yaxis", true).call(yAxisHorizontalLines);
    yAxisHorizontalLines.selectAll("path").style("fill", "none").style("stroke", "#000000");
    yAxisHorizontalLines.selectAll("text").style("fill", "none").style("opacity", 0);
    yAxisHorizontalLines.selectAll("line").style("fill", "none").style("stroke", "#404040").style('stroke-width', 1).style("opacity", .4);
    manaCurveVizWrapper = d3.select('#manaCurveViz');
    if (!manaCurveVizWrapper.attr('transform')) {
      manaCurveVizWrapper.attr('transform', 'translate(0,30)');
    }
    return true;
  };

  DECKVIZ.Deck.deckPie = function(deck, originalDeck) {
    var height, pie, svgEl, svgId, width;
    svgId = '#svg-el-deck-pie';
    $(svgId).empty();
    width = $(svgId).attr('width');
    height = $(svgId).attr('height');
    svgEl = d3.select(svgId);
    return pie = d3.layout.pie;
  };

}).call(this);

(function() {
  var _this = this;

  DECKVIZ.util.calculateCardManaCost = function(cost) {
    var totalCost;
    if (cost === null || cost === void 0) {
      return null;
    } else if (typeof cost === 'number') {
      cost = '' + cost + '';
    }
    cost = cost.replace(/X/gi, '');
    totalCost = parseInt(cost, 10) || 0;
    totalCost += (cost.match(/[UWBRG]/gi) || []).length;
    totalCost -= (cost.match(/\([^pP]\/[^pP]\)/gi) || []).length;
    return totalCost;
  };

  DECKVIZ.util.colorScale = {
    R: '#E33939',
    G: '#78dd60',
    B: '#404040',
    U: '#5d9cdd',
    W: '#fffacf',
    X: '#CBD5F2',
    C: '#909090'
  };

}).call(this);

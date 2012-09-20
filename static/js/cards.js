(function() {
  var _this = this;

  DECKVIZ.Charts.Cards = function() {
    var color_scale, height, width;
    width = $('#svg-el').attr('width');
    height = $('#svg-el').attr('height');
    color_scale = {
      R: '#ff0000',
      G: '#00ff00',
      B: '#000000',
      U: '#0000ff',
      W: '#D6AC51',
      X: '#707070'
    };
    d3.json('/items/setText=ISD|M13|DKA|AVR&sort=color,manacost/', function(data) {
      var bars, manaCost, xscale, yscale;
      yscale = d3.scale.linear().domain([0, 18]).range([0, height]);
      xscale = d3.scale.ordinal().domain(d3.range(data.cards.length)).rangeBands([0, width], 0.2);
      manaCost = function(cost) {
        var costNegative, totalCost;
        costNegative = false;
        if (cost.match(/X/gi)) costNegative = true;
        totalCost = parseInt(cost, 10);
        totalCost += (cost.match(/[UWBRGX]/gi) || []).length;
        if (costNegative) totalCost = totalCost * -1;
        return totalCost;
      };
      return bars = d3.select('#svg-el').selectAll("rect.bars").data(data.cards).enter().append("rect").attr("class", "bars").attr("width", function(d, i) {
        return xscale.rangeBand();
      }).attr("height", function(d, i) {
        return yscale(manaCost(d.manacost || '0'));
      }).attr("fill", function(d, i) {
        return color_scale[d.color || 'X'];
      }).attr("transform", function(d, i) {
        var tx, ty;
        tx = xscale(i);
        ty = height - yscale(manaCost(d.manacost || '0'));
        return "translate(" + [tx, ty] + ")";
      }).on('mouseover', function(d, i) {
        return console.log(d.manacost, d.color, d.name, d.type, d);
      });
    });
    return true;
  };

}).call(this);

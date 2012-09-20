(function() {
  ' ========================================================================    \ntests.coffee\n\nContains all the unit tests for this app\n\nSome common test functions\n----------------------\nok ( state, message ) – passes if the first argument is truthy\nequal ( actual, expected, message ) – a simple comparison assertion with\n    type coercion\n\nnotEqual ( actual, expected, message ) – the opposite of the above\n\nexpect( amount ) – the number of assertions expected to run within each test\n\nstrictEqual( actual, expected, message) – offers a much stricter comparison\n    than equal() and is considered the preferred method of checking equality\n    as it avoids stumbling on subtle coercion bugs\n\ndeepEqual( actual, expected, message ) – similar to strictEqual, comparing \n    the contents (with ===) of the given objects, arrays and primitives.\n======================================================================== ';
  $(document).ready(function() {
    module('UTIL FUNCIONS', {
      setup: function() {
        return this;
      },
      teardown: function() {
        return this;
      }
    });
    test('calculateCardManaCost(): Returns cost', function() {
      var calcCC, util;
      util = DECKVIZ.util;
      calcCC = DECKVIZ.util.calculateCardManaCost;
      strictEqual(calcCC(0), 0, 'Colorless cost of 0 (int) returns 0');
      strictEqual(calcCC(null), null, 'null cost returns null');
      strictEqual(calcCC('0'), 0, 'Colorless cost of 0 returns 0');
      strictEqual(calcCC('1'), 1, 'Colorless cost of 1 returns 1');
      strictEqual(calcCC('2'), 2, 'Colorless cost of 2 returns 2');
      strictEqual(calcCC('18'), 18, 'Colorless cost of 18 returns 18');
      strictEqual(calcCC('B'), 1, 'Cost of B returns 1');
      strictEqual(calcCC('BB'), 2, 'Cost of BB returns 2');
      strictEqual(calcCC('BBBBB'), 5, 'Cost of BBBBB returns 5');
      strictEqual(calcCC('G'), 1, 'Cost of G returns 1');
      strictEqual(calcCC('R'), 1, 'Cost of R returns 1');
      strictEqual(calcCC('U'), 1, 'Cost of U returns 1');
      strictEqual(calcCC('W'), 1, 'Cost of W returns 1');
      strictEqual(calcCC('BW'), 2, 'Cost of BW returns 2');
      strictEqual(calcCC('WB'), 2, 'Cost of WB returns 2');
      strictEqual(calcCC('WRBGU'), 5, 'Cost of WRBGU returns 5');
      strictEqual(calcCC('1B'), 2, 'Cost of 1B returns 2');
      strictEqual(calcCC('4BB'), 6, 'Cost of 4BB returns 6');
      strictEqual(calcCC('3BGUR'), 7, 'Cost of 3BGUR returns 7');
      strictEqual(calcCC('3BGURR'), 8, 'Cost of 3BGURR returns 8');
      strictEqual(calcCC('X'), 0, 'Cost of X returns 0');
      strictEqual(calcCC('X1'), 1, 'Cost of X1 returns 1');
      strictEqual(calcCC('XGG'), 2, 'Cost of XGG returns 2');
      strictEqual(calcCC('XX2BR'), 4, 'Cost of XX2BR returns 4');
      strictEqual(calcCC('1(B/P)(B/P)'), 3, 'Cost of 1(B/P)(B/P) returns 3');
      strictEqual(calcCC('1(B/G)(B/G)'), 3, 'Cost of 1(B/G)(B/G) returns 3');
      strictEqual(calcCC('1GR(B/P)(B/G)(W/U)'), 6, 'Cost of 1GR(B/P)(B/G)(W/U) returns 6');
      return strictEqual(calcCC('1GR(B/P)(B/G)(W/U)XX'), 6, 'Cost of 1GR(B/P)(B/G)(W/U)XX returns 6');
    });
    module('DECK FUNCTIONS: getDeckFromInput', {
      setup: function() {
        return this;
      },
      teardown: function() {
        return this;
      }
    });
    test('getDeckFromInput(): Returns deck object', function() {
      var deckText, getDeck, resultDeck;
      getDeck = DECKVIZ.Deck.getDeckFromInput;
      deckText = '2 Tamiyo, the Moon Sage\n1 Cavern of Souls\n4 Restoration Angel\n1 Thought Scour\n4 Snapcaster Mage\n2 Moorland Haunt\n1 Phantasmal Image\n1 Dismember\n4 Blade Splicer\n4 Gitaxian Probe\n3 Vapor Snag\n1 Consecrated Sphinx\n4 Seachrome Coast\n2 Gideon Jura\n1 Day of Judgment\n4 Glacial Fortress\n1 Gut Shot\n4 Ponder\n4 Plains\n8 Island\n4 Mana Leak';
      resultDeck = {
        "Blade Splicer": 4,
        "Cavern of Souls": 1,
        "Consecrated Sphinx": 1,
        "Day of Judgment": 1,
        "Dismember": 1,
        "Gideon Jura": 2,
        "Gitaxian Probe": 4,
        "Glacial Fortress": 4,
        "Gut Shot": 1,
        "Island": 8,
        "Mana Leak": 4,
        "Moorland Haunt": 2,
        "Phantasmal Image": 1,
        "Plains": 4,
        "Ponder": 4,
        "Restoration Angel": 4,
        "Seachrome Coast": 4,
        "Snapcaster Mage": 4,
        "Tamiyo, the Moon Sage": 2,
        "Thought Scour": 1,
        "Vapor Snag": 3
      };
      deepEqual(getDeck({
        deckText: deckText
      }), resultDeck, 'Creates proper deck object from a properly formatted deckText');
      deckText = 'Invalid\nAnother Invalid';
      resultDeck = {
        'Invalid': NaN,
        'Another Invalid': NaN
      };
      deepEqual(getDeck({
        deckText: deckText
      }), resultDeck, 'Deck without any numbers returns: e.g., { "Invalid": NaN }');
      deepEqual(getDeck({
        deckText: void 0
      }), {}, 'Undefined deckText returns an empty object');
      return deepEqual(getDeck({
        deckText: ''
      }), {}, '"" string for deckText returns an empty object');
    });
    module('DECK FUNCTIONS: getCardTypes', {
      setup: function() {
        return this;
      },
      teardown: function() {
        return this;
      }
    });
    return test('getCardTypes(): Returns correct number of types', function() {
      var deck, func;
      func = DECKVIZ.Deck.getCardTypes;
      equal(func(), false, 'Returns false when no deck is passed in');
      deck = [
        {
          type: 'Instant'
        }
      ];
      deepEqual(func({
        deck: deck
      }), {
        Instant: 1
      }, 'Returns correct number of instants when one is passed in');
      deck = [
        {
          type: 'Instant'
        }, {
          type: 'Instant'
        }
      ];
      deepEqual(func({
        deck: deck
      }), {
        Instant: 2
      }, 'Returns correct number of instants when two instants are passed in');
      deck = [
        {
          type: 'Sorcery'
        }, {
          type: 'Instant'
        }
      ];
      deepEqual(func({
        deck: deck
      }), {
        Sorcery: 1,
        Instant: 1
      }, 'Returns correct object when one sorcery and one instant are passed');
      deck = [
        {
          type: 'Sorcery'
        }, {
          type: 'Instant'
        }, {
          type: 'Sorcery'
        }, {
          type: 'Instant'
        }
      ];
      deepEqual(func({
        deck: deck
      }), {
        Sorcery: 2,
        Instant: 2
      }, 'Returns correct object when two sorcery and two instant are passed');
      deck = [
        {
          type: 'Sorcery'
        }, {
          type: 'Instant'
        }, {
          type: 'Sorcery'
        }, {
          type: 'Instant'
        }, {
          type: 'Instant'
        }, {
          type: 'Sorcery'
        }
      ];
      deepEqual(func({
        deck: deck
      }), {
        Sorcery: 3,
        Instant: 3
      }, 'Returns correct object when 3 sorcery and 3 instant are passed');
      deck = [
        {
          type: 'Sorcery'
        }, {
          type: 'Instant'
        }, {
          type: 'Creature'
        }, {
          type: 'Instant'
        }, {
          type: 'Instant'
        }, {
          type: 'Sorcery'
        }
      ];
      deepEqual(func({
        deck: deck
      }), {
        Sorcery: 2,
        Instant: 3,
        Creature: 1
      }, 'Returns correct object when 2 sorcery and 3 instant and 1 creature are passed');
      deck = [
        {
          type: 'Sorcery'
        }, {
          type: 'Instant'
        }, {
          type: 'Creature'
        }, {
          type: 'Instant'
        }, {
          type: 'Creature'
        }, {
          type: 'Instant'
        }, {
          type: 'Creature'
        }, {
          type: 'Instant'
        }, {
          type: 'Instant'
        }, {
          type: 'Sorcery'
        }
      ];
      return deepEqual(func({
        deck: deck
      }), {
        Sorcery: 2,
        Instant: 5,
        Creature: 3
      }, 'Returns correct object when 2 sorcery and 5 instant and 3 creature are passed');
    });
  });

}).call(this);

''' ========================================================================    
    tests.coffee

    Contains all the unit tests for this app

    Some common test functions
    ----------------------
    ok ( state, message ) – passes if the first argument is truthy
    equal ( actual, expected, message ) – a simple comparison assertion with
        type coercion

    notEqual ( actual, expected, message ) – the opposite of the above

    expect( amount ) – the number of assertions expected to run within each test

    strictEqual( actual, expected, message) – offers a much stricter comparison
        than equal() and is considered the preferred method of checking equality
        as it avoids stumbling on subtle coercion bugs

    deepEqual( actual, expected, message ) – similar to strictEqual, comparing 
        the contents (with ===) of the given objects, arrays and primitives.
    ======================================================================== '''
$(document).ready( ()->

    #=========================================================================
    #Util Funcion Tests
    #=========================================================================
    module('UTIL FUNCIONS',{
        setup: ()->
            return @

        teardown: ()->
            return @
    })

    test('calculateCardManaCost(): Returns cost', ()->
        #Store refs
        util = DECKVIZ.util
        calcCC = DECKVIZ.util.calculateCardManaCost

        #Test invalid values
        strictEqual(
            calcCC(0),
            0,
            'Colorless cost of 0 (int) returns 0'
        )
        strictEqual(
            calcCC(null),
            null,
            'null cost returns null'
        )

        #Test some basic numbers (colorless costs)
        strictEqual(
            calcCC('0'),
            0,
            'Colorless cost of 0 returns 0'
        )
        strictEqual(
            calcCC('1'),
            1,
            'Colorless cost of 1 returns 1'
        )
        strictEqual(
            calcCC('2'),
            2,
            'Colorless cost of 2 returns 2'
        )
        strictEqual(
            calcCC('18'),
            18,
            'Colorless cost of 18 returns 18'
        )

        #Test some basic color cost
        strictEqual(
            calcCC('B'),
            1,
            'Cost of B returns 1'
        )
        strictEqual(
            calcCC('BB'),
            2,
            'Cost of BB returns 2'
        )
        strictEqual(
            calcCC('BBBBB'),
            5,
            'Cost of BBBBB returns 5'
        )

        #Test other colors
        strictEqual(
            calcCC('G'),
            1,
            'Cost of G returns 1'
        )
        strictEqual(
            calcCC('R'),
            1,
            'Cost of R returns 1'
        )
        strictEqual(
            calcCC('U'),
            1,
            'Cost of U returns 1'
        )
        strictEqual(
            calcCC('W'),
            1,
            'Cost of W returns 1'
        )

        #Test color combinations
        strictEqual(
            calcCC('BW'),
            2,
            'Cost of BW returns 2'
        )
        #Make sure order doesn't matter
        strictEqual(
            calcCC('WB'),
            2,
            'Cost of WB returns 2'
        )
        strictEqual(
            calcCC('WRBGU'),
            5,
            'Cost of WRBGU returns 5'
        )

        #Test colorless + color
        strictEqual(
            calcCC('1B'),
            2,
            'Cost of 1B returns 2'
        )
        strictEqual(
            calcCC('4BB'),
            6,
            'Cost of 4BB returns 6'
        )
        strictEqual(
            calcCC('3BGUR'),
            7,
            'Cost of 3BGUR returns 7'
        )
        strictEqual(
            calcCC('3BGURR'),
            8,
            'Cost of 3BGURR returns 8'
        )
        #Test X cost
        #--------------------------------
        #X is 0 in terms of converted mana costs
        strictEqual(
            calcCC('X'),
            0,
            'Cost of X returns 0'
        )
        strictEqual(
            calcCC('X1'),
            1,
            'Cost of X1 returns 1'
        )
        strictEqual(
            calcCC('XGG'),
            2,
            'Cost of XGG returns 2'
        )
        strictEqual(
            calcCC('XX2BR'),
            4,
            'Cost of XX2BR returns 4'
        )

        #Test option costs
        #--------------------------------
        #Life options
        strictEqual(
            calcCC('1(B/P)(B/P)'),
            3,
            'Cost of 1(B/P)(B/P) returns 3'
        )

        #Mana option
        strictEqual(
            calcCC('1(B/G)(B/G)'),
            3,
            'Cost of 1(B/G)(B/G) returns 3'
        )
        strictEqual(
            calcCC('1GR(B/P)(B/G)(W/U)'),
            6,
            'Cost of 1GR(B/P)(B/G)(W/U) returns 6'
        )
        strictEqual(
            calcCC('1GR(B/P)(B/G)(W/U)XX'),
            6,
            'Cost of 1GR(B/P)(B/G)(W/U)XX returns 6'
        )
    )

    #=========================================================================
    #
    #Deck
    #
    #=========================================================================
    module('DECK FUNCTIONS: getDeckFromInput',{
        setup: ()->
            return @

        teardown: ()->
            return @
    })
    test('getDeckFromInput(): Returns deck object', ()->
        #Store refs
        getDeck = DECKVIZ.Deck.getDeckFromInput

        #Let's first test a deck that should work
        deckText = '''2 Tamiyo, the Moon Sage
        1 Cavern of Souls
        4 Restoration Angel
        1 Thought Scour
        4 Snapcaster Mage
        2 Moorland Haunt
        1 Phantasmal Image
        1 Dismember
        4 Blade Splicer
        4 Gitaxian Probe
        3 Vapor Snag
        1 Consecrated Sphinx
        4 Seachrome Coast
        2 Gideon Jura
        1 Day of Judgment
        4 Glacial Fortress
        1 Gut Shot
        4 Ponder
        4 Plains
        8 Island
        4 Mana Leak'''

        resultDeck = {
            "Blade Splicer": 4
            "Cavern of Souls": 1
            "Consecrated Sphinx": 1
            "Day of Judgment": 1
            "Dismember": 1
            "Gideon Jura": 2
            "Gitaxian Probe": 4
            "Glacial Fortress": 4
            "Gut Shot": 1
            "Island": 8
            "Mana Leak": 4
            "Moorland Haunt": 2
            "Phantasmal Image": 1
            "Plains": 4
            "Ponder": 4
            "Restoration Angel": 4
            "Seachrome Coast": 4
            "Snapcaster Mage": 4
            "Tamiyo, the Moon Sage": 2
            "Thought Scour": 1
            "Vapor Snag": 3
        }

        deepEqual(
            getDeck({ deckText: deckText }),
            resultDeck,
            'Creates proper deck object from a properly formatted deckText'
        )

        #Now let's throw some bad data at it
        deckText = '''
        Invalid
        Another Invalid'''
        resultDeck = {
            'Invalid': NaN,
            'Another Invalid': NaN
        }
        deepEqual(
            getDeck({ deckText: deckText }),
            resultDeck,
            'Deck without any numbers returns: e.g., { "Invalid": NaN }'
        )

        #Make sure it doesn't blow up if we pass in undefined or an empty string
        deepEqual(
            getDeck({ deckText: undefined }),
            {},
            'Undefined deckText returns an empty object'
        )
        deepEqual(
            getDeck({ deckText: '' }),
            {},
            '"" string for deckText returns an empty object'
        )
    )

    #=========================================================================
    #
    #getCardTypes
    #
    #=========================================================================
    module('DECK FUNCTIONS: getCardTypes',{
        #getCardTypes takes in a deck object and returns an object containing
        #   the number of card types - e.g. {'Instant': 9} if a deck had 9
        #   instants
        setup: ()->
            return @

        teardown: ()->
            return @
    })
    
    test('getCardTypes(): Returns correct number of types', ()->
        #Store ref to func
        func = DECKVIZ.Deck.getCardTypes

        #Make sure it returns false if no deck was passed in
        equal(func(), false, 'Returns false when no deck is passed in')

        #Test it with a single instant
        deck = [ {type: 'Instant'} ]
        deepEqual(
            func({deck: deck}),
            { Instant: 1 },
            'Returns correct number of instants when one is passed in'
        )

        #Test it with two instants
        deck = [ {type: 'Instant'}, {type: 'Instant'} ]
        deepEqual(
            func({deck: deck}),
            { Instant: 2 },
            'Returns correct number of instants when two instants are passed in'
        )

        #Mix up tests now
        deck = [ {type: 'Sorcery'}, {type: 'Instant'} ]
        deepEqual(
            func({deck: deck}),
            { Sorcery: 1, Instant: 1 },
            'Returns correct object when one sorcery and one instant are passed'
        )

        deck = [ {type: 'Sorcery'}, {type: 'Instant'},
                {type: 'Sorcery'}, {type: 'Instant'} ]
        deepEqual(
            func({deck: deck}),
            { Sorcery: 2, Instant: 2 },
            'Returns correct object when two sorcery and two instant are passed'
        )

        deck = [ {type: 'Sorcery'}, {type: 'Instant'},
                {type: 'Sorcery'}, {type: 'Instant'},
                {type: 'Instant'}, {type: 'Sorcery'} ]
        deepEqual(
            func({deck: deck}),
            { Sorcery: 3, Instant: 3 },
            'Returns correct object when 3 sorcery and 3 instant are passed'
        )

        deck = [ {type: 'Sorcery'}, {type: 'Instant'},
                {type: 'Creature'}, {type: 'Instant'},
                {type: 'Instant'}, {type: 'Sorcery'} ]
        deepEqual(
            func({deck: deck}),
            { Sorcery: 2, Instant: 3, Creature: 1 },
            'Returns correct object when 2 sorcery and 3 instant and 1 creature are passed'
        )

        deck = [ {type: 'Sorcery'}, {type: 'Instant'},
                {type: 'Creature'}, {type: 'Instant'},
                {type: 'Creature'}, {type: 'Instant'},
                {type: 'Creature'}, {type: 'Instant'},
                {type: 'Instant'}, {type: 'Sorcery'} ]
        deepEqual(
            func({deck: deck}),
            { Sorcery: 2, Instant: 5, Creature: 3 },
            'Returns correct object when 2 sorcery and 5 instant and 3 creature are passed'
        )

        #TODO: Test creature types
        
    )
)

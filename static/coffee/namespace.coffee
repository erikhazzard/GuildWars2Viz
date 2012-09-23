# ===========================================================================
#
# namespace.js
#
# Sets up namespacing for the app
# ===========================================================================
GW2VIZ = (()=>
    app = {}

    #Functions
    init = ()=>
        return true

    #Utility functions
    util = {
        capitalize: (text)=>
            return text.charAt(0).toUpperCase() + text.substring(1)
    }

    #Detect filter support
    filterSupport = Modernizr.svgfilters
    #Quality level
    #   0 = lowest quality (IE level)
    #   1 = medium quality (FF)
    #   2 = normal / high quality (Chrome / Safari)
    qualityLevel = 2
    
    #Determine wheter to use a lower quality effect or not
    if $.browser.mozilla
        qualityLevel = 1

    #If IE, lowest quality
    if $.browser.msie or not filterSupport
        qualityLevel = 0

    #Public API returned
    return {
        init: init
        util: util
        data: {}
        
        qualityLevel: qualityLevel
        visualizations: {}
    }

)()

window.GW2VIZ = GW2VIZ

# ===========================================================================
#
# Init
#
# ===========================================================================
GW2VIZ.init = ()=>
    #Setup data
    GW2VIZ.data = {
        gender: [
            {label: "Male", value: 63},
            {label: "Female", value: 37}
        ],
        race: [
            {label:"Charr", value:14.32},
            {label:"Asura", value:15.31},
            {label:"Sylvari", value:15.31},
            {label:"Norn", value:20.25},
            {label:"Human", value:34.81}
        ],
        profession: [
            { label: "Engineer", value:10.21},
            { label: "Mesmer", value:10.21},
            { label: "Necromancer", value:11.31},
            { label: "Guardian", value:12.40},
            { label: "Thief", value:12.40},
            { label: "Elementalist", value:13.39},
            { label: "Ranger", value:14.49},
            { label: "Warrior", value:15.59}
        ],
        tradeskill: [
            { label: "Artificer", value: 8.2 },
            { label: "Armorsmith", value: 10.74},
            { label: "Huntsman", value: 10.74 },
            { label: "Chef", value: 13.51 },
            { label: "Jeweler", value: 13.51 },
            { label: "Leatherworker", value: 13.51 },
            { label: "Tailor", value: 13.51 },
            { label: "Weaponsmith", value: 16.28 }
        ]
    }

    #Maps solid colors for each type
    GW2VIZ.visualizations.colors = {
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
    }

    #Create the class viz
    GW2VIZ.visualizations.donutViz()
    GW2VIZ.visualizations.barViz()

    return true

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

    #Public API returned
    return {
        init: init
        util: util
        
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
    #Create the class viz
    GW2VIZ.visualizations.classes()

    return true

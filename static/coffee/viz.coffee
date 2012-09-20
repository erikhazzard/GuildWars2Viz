# ===========================================================================
#
# viz.coffee
#
# Contains the visualization code
#
# ===========================================================================
# dummy data
#--------NORMALIZED
#DATA = [
#    { name: 'Engineer', value: 66, color: "#d94d4c" },
#    { name: 'Theif', value: 80, color: "#d9824d" },
#    { name: 'Elementalist', value: 85, color: "#eda338" },
#    { name: 'Guardian', value: 100, color: "#a6a638" },
#    { name: 'Mesmer', value: 66, color: "#86a965" },
#    { name: 'Ranger', value: 92, color: "#68c7ff" },
#    { name: 'Warrior', value: 80, color: "#4ab3d1" },
#    { name: 'Necromancer', value: 73, color: "#87abab" }
#]
#
#
#   Static data from graphic (positions are based on graphic
#    DATA = [
#        { name: 'Engineer', value: height - 51, color: "#d94d4c" },
#        { name: 'Theif', value: height - 32, color: "#d9824d" },
#        { name: 'Elementalist', value: height - 23, color: "#eda338" },
#        { name: 'Guardian', value: height - 3, color: "#a6a638" },
#        { name: 'Mesmer', value: height - 51, color: "#86a965" },
#        { name: 'Ranger', value: height - 13, color: "#68c7ff" },
#        { name: 'Warrior', value: height - 32, color: "#4ab3d1" },
#        { name: 'Necromancer', value: height - 42, color: "#87abab" }
#    ]


GW2VIZ.visualizations.classes = (params) =>
    #Create the visualization for classes
    #Get svg el
    svg = d3.select('#svg-el-class-viz')

    #Get width / height
    width = svg.attr('width')
    height = svg.attr('height')

    #Add group for viz
    yAxisGroup = svg.append('svg:g')
    chartGroup = svg.append('svg:g')

    #Get data
    #--------Percentages
    DATA = [
        { name: 'Engineer', value: 10.2, color: "#d94d4c" },
        { name: 'Theif', value: 12.5, color: "#d9824d" },
        { name: 'Elementalist', value: 13.3, color: "#eda338" },
        { name: 'Guardian', value: 15.5, color: "#a6a638" },
        { name: 'Mesmer', value: 10.2, color: "#86a965" },
        { name: 'Ranger', value: 14.4, color: "#68c7ff" },
        { name: 'Warrior', value: 11.5, color: "#4ab3d1" },
        { name: 'Necromancer', value: 12.5, color: "#87abab" }
    ]
    #------------------------------------
    #Group config
    #------------------------------------
    padding = { top: 10, right: 10, bottom: 10, left: 34 }

    barGroupWidth = width - padding.left - padding.right

    #Chart config
    #   Padding space between bars
    barPadding = 2
    #   Radius for bar 
    barRadius = 2
    barStartLeft = 10

    dataMax = _.max(DATA, (datum)=>
        return datum.value
    ).value
    #------------------------------------
    #x / y scale
    #------------------------------------
    xScale = d3.scale.linear()
        #Use rangeRound since we want exact integers
        .range([padding.left + barStartLeft, width])
        .domain([0, DATA.length])

    yScale = d3.scale.linear()
        .range([0, height - padding.top])
        .domain([0, dataMax])
    #------------------------------------
    #Add bars
    #------------------------------------
    dataBars = chartGroup.selectAll('rect')
       .data(DATA)

    #Add each bar
    dataBars.enter()
        .append('svg:rect')
        .attr({
            width: (barGroupWidth / DATA.length) - barPadding,
            x: (d,i)=>
                return xScale(i)
            height: (d,i)=>
                return 7
            y: (d,y)=>
                return height
            rx: barRadius
        })
        .style({
            fill: (d,i)=>
                return d.color
        })

    #animate it with transition
    #   These are the final values
    dataBars.transition()
        .duration(300)
        .ease('linear')
        .attr({
            height: (d,i)=>
                return yScale(d.value)
            y: (d,y)=>
                return height - yScale(d.value)
        })

    #------------------------------------
    #Add axis
    #------------------------------------
    #Bottom axis
    svg.append("line")
        .attr({
            x1: padding.left - barPadding
            x2: width - padding.right
            y1: height - .5
            y2: height - .5
        })
        .style("stroke", "#232323")

    #------------------------------------
    #y axis (on left side)
    #------------------------------------
    tickYScale = d3.scale.linear()
        #Goes from highest occurence of cards with that mana cost to 0
        .range([0, height])
        .domain([dataMax, 0])

    #Create axis for ticks
    yAxisTicks = d3.svg.axis()
        .scale(tickYScale)
        .ticks(10)
        .orient("left")
        #give it a tick size to make it go across the graph
        .tickSize(-width)

    #Add groups
    yAxisGroup.attr("transform", "translate(" + [padding.left, 0] + ")")
        .classed("yaxis", true)
        .call(yAxisTicks)
    yAxisGroup.selectAll("path")
        .style("fill", "none")
        .style("stroke", "#000000")
    yAxisGroup.selectAll("line")
        .style("fill", "none")
        .style("stroke", "#404040")
        .style('stroke-width', 1)
        #Note: the horizontal lines stack on each other, so we'll get
        #   a slightly darker line for each of the ticks in this group
        .style("opacity", .4)

# ===========================================================================
#
# viz.coffee
#
# Contains the visualization code
#
# ===========================================================================
GW2VIZ.visualizations.barViz = (params) =>
    createChart = GW2VIZ.visualizations.createChart
    createChart({
        chartType: 'profession'
    })
    createChart({
        chartType: 'tradeskill'
    })
    createChart({
        chartType: 'race'
    })

GW2VIZ.visualizations.createChart = (params) =>
    #Create the bar charts
    #Check params
    chartType = params.chartType

    #Maps solid colors for each type
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
    }
    #Get svg el
    svg = d3.select('#svg-el-' + chartType)

    #Get width / height
    width = svg.attr('width')
    height = svg.attr('height')

    #Add group for viz
    yAxisGroup = svg.append('svg:g').attr({'class': 'axisGroup'})
    chartGroup = svg.append('svg:g').attr({'class': 'barWrapper'})

    data = GW2VIZ.data[chartType]

    #------------------------------------
    #Group config
    #------------------------------------
    padding = { top: 10, right: 10, bottom: 20, left: 34 }

    barGroupWidth = width - padding.left - padding.right

    #Chart config
    #   Padding space between bars
    barPadding = 2
    #   Radius for bar 
    barRadius = 0
    barStartLeft = 10

    #Get the highest data value
    dataMax = _.max(data, (datum)=>
        return datum.value
    ).value

    #Add some padding to it
    dataMax += 4

    #------------------------------------
    #x / y scale
    #------------------------------------
    xScale = d3.scale.linear()
        #Use rangeRound since we want exact integers
        .range([padding.left + barStartLeft, width])
        .domain([0, data.length])

    yScale = d3.scale.linear()
        .range([0, height - padding.top - padding.bottom])
        .domain([0, dataMax])
    #------------------------------------
    #Add bars
    #------------------------------------
    dataBarGroups = chartGroup.selectAll('g.chartBars')
       .data(data)

    #Add each bar group
    dataBarGroups.enter()
        .append('svg:g').attr({'class': 'chartBars'})

    #Cleanup
    dataBarGroups.exit().remove()

    #Get rect bars
    dataBars = dataBarGroups.selectAll('rect.bar')
        .data(data)

    #Add bars
    #------------------------------------
    dataBars.enter()
        .append('svg:rect')
        .attr({
            'class': 'bar',
            'id': (d,i)=>
                return 'bar-' + chartType + '-' + d.label
            width: (barGroupWidth / data.length) - barPadding,
            x: (d,i)=>
                return xScale(i)
            height: (d,i)=>
                return 0
            y: (d,y)=>
                return height - padding.top - padding.bottom
            rx: barRadius
        })
        .style({
            stroke: "#343434"
            fill: (d,i)=>
                #return "url(#" + chartType + data[i].label + 'Gradient)'
                #solid color
                return colors[data[i].label]
        })

    #Cleanup
    dataBars.exit().remove()

    #animate it with transition
    #   These are the final values
    dataBars
        #NOTE: Could use transiiton here
        #.transition()
        .attr({
            height: (d,i)=>
                return yScale(d.value)
            y: (d,y)=>
                return height - yScale(d.value) - padding.bottom - padding.top
        })

    #Text labels
    #------------------------------------
    #Get rect bars
    barLabels = dataBarGroups.selectAll('text')
        .data(data)

    barLabels.enter()
        .append('svg:text')
            .attr({
                x: (d,i)=>
                    return xScale(i) + 6
                y: height - padding.bottom - padding.top - 3
            }).style({
                'font-size': '.9em',
                fill: '#f0f0f0',
                'text-shadow': '0 1px 1px #000000'
            }).text((d,i)=>
                return d.value + '%'
            )
    

    #------------------------------------
    #y axis (on left side)
    #------------------------------------
    tickYScale = d3.scale.linear()
        #Goes from highest occurence of cards with that mana cost to 0
        .range([0, height-padding.top-padding.bottom])
        .domain([dataMax, 0])

    #Create axis for ticks
    yAxisTicks = d3.svg.axis()
        .scale(tickYScale)
        .ticks(5)
        .orient("left")
        #give it a tick size to make it go across the graph
        .tickSize(-width)

    #Add groups
    yAxisGroup.attr("transform", "translate(" + [padding.left, 0] + ")")
        .classed("yaxis", true)
        .call(yAxisTicks)
    yAxisGroup.selectAll("path")
        .style("fill", "none")
        .style("stroke", "#505050")
    yAxisGroup.selectAll("line")
        .style("fill", "none")
        .style("stroke", "#606060")
        .style('stroke-width', 1)
        #Note: the horizontal lines stack on each other, so we'll get
        #   a slightly darker line for each of the ticks in this group
        .style("opacity", .4)
    yAxisGroup.selectAll("text")
        .style({
            fill: "#343434",
            'font-size': '.6em',
            'text-shadow': '0 0 1px #ffffff'
        }).text((d,i)=>
            return d + '%'
        )

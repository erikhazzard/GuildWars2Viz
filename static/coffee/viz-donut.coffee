# ===========================================================================
#
# viz-donut.coffee
#
# Contains the visualization code
#
# ===========================================================================
GW2VIZ.visualizations.donutViz = (params) =>
    #Data object
    data = {
        gender: [
            {label: "Male", value: 63},
            {label: "Female", value: 37}
        ],
        race: [
            {label:"Asura", value:15.31},
            {label:"Charr", value:14.32},
            {label:"Human", value:34.81},
            {label:"Norn", value:20.25},
            {label:"Sylvari", value:15.31}
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

    #Race patterns
    svg = d3.select('#svg-el-donut')

    #Create group for donut charts and make it slightly smaller
    donutGroup = svg.append('svg:g').attr({
        id: 'donutGroup',
        transform: "translate(" + [0,0] + ") scale(0.9)"
    })
    width = svg.attr('width')
    height = svg.attr('height')

    #Detect filter support
    filterSupport = Modernizr.svgfilters

    #====================================================================
    #
    #  Create chart function
    #
    #====================================================================
    createChart = (options)=>
        #-----------------------------------
        #Config
        #-----------------------------------
        labelSize = options.labelSize
        radius = options.radius
        innerRadius = options.innerRadius || false
        chartType = options.chartType
        usePiePattern = options.usePiePattern
        pieFill = options.pieFill

        #Base variables
        bgLabelModifier = 5
        startTextOpacity = 0.2

        #Update pattern size
        d3.selectAll('.patternRace').attr({
            width: radius, height: radius
        })
            
        #Create patterns to use in the charts
        #Create visualization
        chartGroup = donutGroup.append('svg:g')
            #move the center of the pie chart from 0, 0 to radius, radius
            .attr({
                id: chartType + "-donut",
                'class': 'chartGroup',
                transform: "translate(" + [width/2, height/2] + ")"
            })
            .data([data[chartType]])

        #Arc for visualization
        arc = d3.svg.arc()
            .outerRadius(radius)
        if innerRadius
            arc.innerRadius(innerRadius)
        
        #this will create arc data for us given a list of values
        pie = d3.layout.pie()
            #we must tell it out to access the value of each element in our data array
            .value((d)=>
                return d.value
            )

        #Create the slicees
        arcs = chartGroup.selectAll("g.slice")
            #associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .data(pie)
            .enter()
                #create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .append("svg:g")
                    #allow us to style things in the slices (like text)
                    .attr("class", (d,i)=>
                        return "slice slice" + i
                    )

        #Append just the stroke and white fill
        arcs.append("svg:path")
            #set the color for each slice to be chosen from the color function defined above
            #this creates the actual SVG path using the associated data (pie) with the arc drawing function
            .attr("d", arc)
            .style({
                fill: "#ffffff",
                stroke: "#707070",
                "stroke-width": 2
            })

        #Append just the stroke and white fill, give it a filter too
        edgeSlice = arcs.append("svg:path")
            .attr({
                d:arc,
                'class': (d,i)=>
                    return 'edgeSlice' + i
            })
            .style({
                fill: "#ffffff",
                stroke: "#707070",
                "stroke-opacity": 0.6,
                filter: "url(#jaggedEdge)",
                "stroke-width": 1
            })

        #---------------------------
        #Append the watercolored background image
        #---------------------------
        arcs.append("svg:path")
            #set the color for each slice to be chosen from the color function defined above
            #this creates the actual SVG path using the associated data (pie) with the arc drawing function
            .attr({
                d:arc,
                'class': (d,i)=>
                    return 'slice' + i
            })
            .style({
                fill: (d,i)=>
                    if usePiePattern == true
                        return "url(#" + chartType + d.data.label + "Gradient)"
                    else
                        return pieFill[i]
                ,
                stroke: "#343434",
                filter: "url(#waterColor1)",
                "stroke-width": 2,
                "stroke-opacity": 1
            })

        #-------------------------------
        #add a label to each slice
        #-------------------------------
        #  label with some effects as the base
        textGroup = arcs.append('svg:g')
            .attr({
                'class': (d,i)=>
                    return 'textGroup textGroup' + i
            }).style({
                opacity: startTextOpacity
            })

        #Background label, transparent and larger font
        textGroup.append("svg:text")
            .attr({
                "transform": (d,i)=>
                    #we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0
                    d.outerRadius = radius

                    #Get x and y
                    x = arc.centroid(d)[0]
                    y = arc.centroid(d)[1]
                    #If the length of the text is too big, move the text to the
                    #   right so it doesn't get cut off
                    if data[chartType][i].label.length == 'Necromancer'
                        x += 8

                    #this gives us a pair of coordinates like [50, 50]
                    return "translate(" + [x,y] + ")"
                ,
                "class": "bgLabel",
                #center the text on it's origin
                "text-anchor": "middle"
            }).style({
                fill: "#ababab",
                filter: "url(#waterColor2)",
                "font-size": labelSize + bgLabelModifier + "px",
                opacity: 0.7,
                "text-shadow": "0 0 1px #000000"
            })
            #get the label from our original data array
            .text((d, i)=>
                return data[chartType][i].label
            )

        #"final" label for name
        textGroup.append("svg:text")
            .attr({
                "transform": (d,i)=>
                    #we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0
                    d.outerRadius = radius
                    #Get x and y
                    x = arc.centroid(d)[0]
                    y = arc.centroid(d)[1]
                    #If the length of the text is too big, move the text to the
                    #   right so it doesn't get cut off
                    if data[chartType][i].label == 'Necromancer'
                        x += 14

                    #this gives us a pair of coordinates like [50, 50]
                    return "translate(" + [ x, y ] + ")"
                ,
                #Make sure we change fontsize for this label
                "class": "label",
                #center the text on it's origin
                "text-anchor": "middle"
            }).style({
                fill: "#ffffff",
                "font-weight": "bold",
                "font-size": labelSize + 'px',
                "text-shadow": "0 0 3px #000000, 0 0 9px #000000"
            })
            #get the label from our original data array
            .text((d, i)=>
                return data[chartType][i].label
            )

        #add a label for % of total
        #-------------------------------
        textGroup.append("svg:text")
            .attr({
                #Make sure we change fontsize for this label
                "transform": (d)=>
                    #we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0
                    d.outerRadius = radius
                    #this gives us a pair of coordinates like [50, 50]
                    return "translate(" + [
                        arc.centroid(d)[0],
                        arc.centroid(d)[1] + labelSize
                        ] + ")"
                ,
                #center the text on it's origin
                "text-anchor": "middle"
            }).style({
                fill: "#ffffff",
                "font-size": "1.1em",
                "text-shadow": "0 0 3px #000000"
            })
            #get the label from our original data array
            .text((d, i)=>
                return Math.round(data[chartType][i].value) + '%' 
            )

        #---------------------------
        #INTERACTION
        #---------------------------
        arcs.on('mouseover', (d,i)=>
            #Update slice
            #-----------------------
            chartGroup.select('.edgeSlice' + i)
                .transition().duration(500)
                .style({
                'stroke-width': 9,
                'stroke': '#000000',
                'stroke-opacity': 0.8
            })

            #Update text label
            #LABEL
            #-----------------------
            #LABEL Opacity
            d3.selectAll('.textGroup').style({ opacity:startTextOpacity })
            chartGroup.selectAll('.textGroup').style({ opacity:0.9 })
            chartGroup.selectAll('.textGroup' + i).style({ opacity: 1 })

            chartGroup.selectAll('.textGroup' + i + ' .label').style({
                'font-size': labelSize + 6
            })

            #Update the big bglabel
            chartGroup.selectAll('.textGroup' + i + ' .bgLabel').style({
                'font-size': labelSize + bgLabelModifier + 6
            })
            chartGroup.selectAll('.textGroup' + i + ' .bgLabel').attr({
                transform: (d,i)=>
                    return "translate(" + arc.centroid(d) + ") rotate(" + (18 + (i*3)) + ")"
            })
        ).on('mouseout', (d,i)=>
            #SLICE
            #Update slice
            chartGroup.select('.edgeSlice' + i)
                .transition().duration(500)
                .style({
                    'stroke-width': 1,
                    'stroke': '#707070',
                    'stroke-opacity': 0.6
                })

            #LABELS
            #Reset the label font size
            chartGroup.selectAll('.textGroup .label').style({
                'font-size': labelSize
            })
            #Reset the bg label font size
            chartGroup.selectAll('.textGroup' + i + ' .bgLabel').attr({
                transform: (d,i)=>
                    return "translate(" + arc.centroid(d) + ") rotate(0)"
            })
            chartGroup.selectAll('.textGroup' + i + ' .bgLabel').style({
                'font-size': labelSize + bgLabelModifier
            })
            #LABEL Opacity
            chartGroup.selectAll('.textGroup').style({
                opacity:startTextOpacity
            })
        )

    #====================================================================
    #  
    # Create charts
    #
    #====================================================================
    #Create chart, passing in params for each type. The radius and innerRadius
    #  should match the inner chart's radius to align properly (see the races
    #  and professions radius values)
    #If there is an image to use define the pattern above and set usePiePattern
    #  to true. If not, set it to false and pass in an array of colors

    # GENDER ( inner pie )
    createChart({
        labelSize: 14,
        radius: 68,
        chartType: 'gender',
        usePiePattern: true
    })

    # RACES ( first donut )
    createChart({
        labelSize: 17,
        radius: 160,
        innerRadius: 70,
        chartType: 'race',
        usePiePattern: true
    })
    
    # PROFESSION ( second donut )
    createChart({
        labelSize: 16,
        radius: 270,
        innerRadius: 162,
        chartType: 'profession',
        usePiePattern: true,
    })

    # TRADESKILL ( third donut )
    createChart({
        labelSize: 17,
        radius: 344,
        innerRadius: 272,
        chartType: 'tradeskill',
        usePiePattern: true,
        #pieFill: ['#d84c4b', '#d9824d', '#eca539',
        #    '#a6a538', '#87aa66', '#68c7ff',
        #    '#4ab3d1', '#87aaac'
        #]
        #pieFill: ['#3eddc7', '#454545', '#73895d',
        #    '#377EB8', '#984EA3', '#A65628',
        #    '#c2ad4d','#E41A1C'
        #]
    })




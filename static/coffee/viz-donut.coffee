# ===========================================================================
#
# viz-donut.coffee
#
# Contains the visualization code
#
# ===========================================================================
GW2VIZ.visualizations.donutViz = (params) =>
    #Data object
    data = GW2VIZ.data

    #Race patterns
    svg = d3.select('#svg-el-donut')

    #Amount to scale chart
    baseScaleAmount = 0.94

    #Adjust based on width / height
    documentWidth = $(document).width()
    documentHeight = $(document).height()

    #Set sacle amount. 0.94 is the base
    scaleAmount = documentWidth / 1380
    if scaleAmount > baseScaleAmount
        scaleAmount = baseScaleAmount

    #Create group for donut charts and make it slightly smaller
    donutGroup = svg.append('svg:g').attr({
        id: 'donutGroup',
        transform: "translate(" + [0,20] + ") scale(" + scaleAmount + ")"
    })

    #Get width / height of SVG
    width = svg.attr('width')
    height = svg.attr('height')

    #update if necessary
    if documentWidth < 1200
        svg.attr({width: documentWidth - parseInt($('#right-content').width(), 10)})

    #Store ref to quality level
    qualityLevel = GW2VIZ.qualityLevel

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
        callback = options.callback

        #Base variables
        bgLabelModifier = 5
        startingTextOpacity = 0
        startingIconOpacity = 0.6

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
        filteredSlice = arcs.append("svg:path")
            #set the color for each slice to be chosen from the color function defined above
            #this creates the actual SVG path using the associated data (pie) with the arc drawing function
            .attr("d", arc)
            .style({
                fill: "#ffffff",
                stroke: "#505050",
                filter: ()=>
                    if qualityLevel < 2
                        #No filter for lower quality
                        return ''
                    else
                        return "url(#waterColor2)"
                "stroke-width": 4
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
                filter: ()=>
                    if qualityLevel < 1
                        #No filter for lower quality
                        return ''
                    else
                        return "url(#jaggedEdge)"
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
                filter: ()=>
                    #Water color filder is expensive and not performant in FF
                    if qualityLevel < 1
                        return ''
                    else
                        return "url(#waterColor1)"

                "stroke-width": 2,
                "stroke-opacity": 1
            })

        #---------------------------
        #ICONS
        #---------------------------
        iconGroup = arcs.append('svg:g')
            .attr({
                'class': (d,i)=>
                    return 'iconGroup iconGroup' + i
            }).style({
                opacity: startingIconOpacity
            })

        imageSize = {
            height: 54,
            width: 54
        }

        #Icon image
        iconGroup.append("svg:image")
            .attr({
                "xlink:href": (d,i)=>
                    return "/static/img/viz/" + d.data.label + ".png"
                x:(d)=>
                    d.innerRadius = 0
                    d.outerRadius = radius
                    arc.centroid(d)[0] - (imageSize.width / 2)
                    
                y:(d)=>
                    d.innerRadius = 0
                    d.outerRadius = radius
                    arc.centroid(d)[1] - (imageSize.height / 2)

                width: imageSize.width + 'px',
                height: imageSize.height + 'px',
            })
        #-------------------------------
        #LABEL
        #-------------------------------
        #  label with some effects as the base
        textGroup = arcs.append('svg:g')
            .attr({
                'class': (d,i)=>
                    return 'textGroup textGroup' + i
            }).style({
                opacity: startingTextOpacity
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
                    if d.data.label.length == 'Necromancer'
                        x += 8

                    #this gives us a pair of coordinates like [50, 50]
                    return "translate(" + [x,y] + ")"

                "class": "bgLabel",
                #center the text on it's origin
                "text-anchor": "middle"
            }).style({
                fill: "#ababab",
                filter: ()=>
                    if qualityLevel < 2
                        return ''
                    else
                        return "url(#waterColor2)"
                "font-size": labelSize + bgLabelModifier + "px",
                opacity: 0.7,
                "text-shadow": "0 0 1px #000000"
            })
            #get the label from our original data array
            .text((d, i)=>
                return d.data.label
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
                    if d.data.label == 'Necromancer'
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
                "text-shadow": "0 0 3px #000000, 0 0 18px #000000"
            })
            #get the label from our original data array
            .text((d, i)=>
                return d.data.label
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
                return Math.round(d.data.value) + '%' 
            )

        #---------------------------
        #INTERACTION
        #---------------------------
        #Save d3 selections so we dont make DOM look ups in each event
        allTextGroups = d3.selectAll('.textGroup')
        thisTextGroup = chartGroup.selectAll('.textGroup')
        allLabels = chartGroup.selectAll('.textGroup .label')

        #Only enable interaction for high quality
        if qualityLevel > 1
            arcs.on('mouseover', (d,i)=>
                #Update slice
                #-----------------------
                #For high quality do animation, otherwise instantly show it
                if qualityLevel > 1
                    chartGroup.select('.edgeSlice' + i)
                        .style({
                            'stroke-width': 9,
                            'stroke': '#000000',
                            'stroke-opacity': 0.8
                        })
                else
                    chartGroup.select('.edgeSlice' + i)
                        .style({
                            'stroke-width': 9,
                            'stroke': '#000000',
                            'stroke-opacity': 1
                        })

                #Update text label
                #LABEL
                #-----------------------
                #LABEL Opacity
                allTextGroups.style({ opacity:startingTextOpacity })
                thisTextGroup.style({ opacity:0.9 })
                #Get the current selected item
                curGroup = chartGroup.selectAll('.textGroup' + i)
                curGroup.style({ opacity: 1 })
                curGroup.selectAll('.label').style({
                    'font-size': labelSize + 6
                })

                #Update the big bglabel
                curGroup.selectAll('.bgLabel').style({
                    'font-size': labelSize + bgLabelModifier + 6
                }).attr({
                    transform: (d,i)=>
                        return "translate(" + arc.centroid(d) + ") rotate(" + (18 + (i*3)) + ")"
                })

                #Fade out icons
                if qualityLevel > 1
                    iconGroup.style({opacity: 0.3})

                #Dont update bar (none exists) if it's gender
                if chartType != 'gender'
                    #UPDATE bar
                    GW2VIZ.visualizations.barHighlightOver({
                        chartType:chartType,
                        d: d
                        i: i
                    })

            ).on('mouseout', (d,i)=>
                #SLICE
                #Update slice
                if qualityLevel > 1
                    chartGroup.select('.edgeSlice' + i)
                        .style({
                            'stroke-width': 1,
                            'stroke': '#707070',
                            'stroke-opacity': 0.6
                        })
                else
                    chartGroup.select('.edgeSlice' + i)
                        .transition().duration(300)
                        .style({
                            'stroke-width': 1,
                            'stroke': '#707070',
                            'stroke-opacity': 0.6
                        })

                #LABELS
                #Reset the label font size
                allLabels.style({
                    'font-size': labelSize
                })
                #Reset the bg label font size
                chartGroup.selectAll('.textGroup' + i + ' .bgLabel').attr({
                    transform: (d,i)=>
                        return "translate(" + arc.centroid(d) + ") rotate(0)"
                }).style({
                    'font-size': labelSize + bgLabelModifier
                })

                #LABEL Opacity
                thisTextGroup.style({
                    opacity:startingTextOpacity
                })

                #Show icons back to original opacity
                if qualityLevel > 1
                    iconGroup.style({opacity: startingIconOpacity})

                #Dont update bar (none exists) if it's gender
                if chartType != 'gender'
                    #Update bar chart
                    GW2VIZ.visualizations.barHighlightOut({
                        chartType:chartType,
                        d: d
                        i: i
                    })
            )

        #Call the callback if pased in
        if callback
            callback()

    #END FUNCTION

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
        radius: 350,
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
        callback: ()=>
            #Hide loading message
            $('#loading').css({opacity: 0, display: 'none' })
    })




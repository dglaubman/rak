$ ->
  semver: "0.1.1"
  runDpm = ->

    width = 720
    height = 570
    widgetWidth = 100
    widgetHeight = 48
    knobRadius = 12
    squareSide = 18
    color = d3.scale.category20()
    diagonal = d3.svg.diagonal()

    nodes = [
        name: "Refresh"
        group: 1
      ,
        name: "ETL"
        group: 3
      ,
        name: "Rollup"
        group: 5
      ,
        name: "Reinstate"
        group: 7
      ,
        name: "Report"
        group: 9
      ,
        name: "Merge"
        group: 11
      ,
        name: "ReportRegion"
        group: 13
    ]

    links = [
      { "source":0, "target":1, "rak": 1},
      { "source":1, "target":2, "rak": 1},
      { "source":2, "target":3, "rak": 2},
      { "source":3, "target":4, "rak": 3},
      { "source":2, "target":4, "rak": 4},
      { "source":4, "target":5, "rak": 1}

    ]

    svg = d3.select("#chart svg")
    svg.selectAll(".node").remove()

    link = svg.selectAll("path.link")
        .data(links)
      .enter()
          .append("path")
          .attr("class", "link")
          .attr("d", diagonal)

    node = svg.selectAll("g.node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
#        .on 'click',  ((d,i) -> d.fixed = 1), true

    ellipses = node
        .append("ellipse")
        .attr("class", "node")
        .attr("rx", widgetWidth / 2)
        .attr("ry", widgetHeight / 2)
        .style("fill", (d) ->  color d.group )

    rects = node
        .append("rect")
        .attr("class", "node")
        .attr("height", squareSide)
        .attr("width", squareSide)
        .style("fill", (d) ->  color d.group )

    circles = node
        .append( "circle" )
        .attr( "class", "node" )
        .attr( "r", knobRadius )
        .style( "fill", (d) -> color d.group )

    texts = node
        .append( "text" )
        .attr( "class", "node" )
        .text( (d) ->  d.name )

    msgs = node
        .append( "text" )
        .attr( "class", "node status" )

    force = d3.layout.force().
        charge(-500)
        .gravity(0.2)
        .linkDistance(widgetWidth / 2)
        .size([ width, height ])

    force.on "tick", ->
        # link
        #   .attr( "x1", (d) -> d.source.x + widgetWidth / 2 + knobRadius )
        #   .attr( "y1", (d) -> d.source.y )
        #   .attr( "x2", (d) -> d.target.x - widgetWidth / 2 - squareSide / 2 )
        #   .attr( "y2", (d) -> d.target.y )

        ellipses
          .attr( "cx", (d) -> d.x )
          .attr( "cy", (d) -> d.y )

        circles
          .attr( "cx", (d) -> d.x + widgetWidth / 2 + knobRadius / 2 )
          .attr( "cy", (d) -> d.y )

        rects
          .attr( "x", (d) -> d.x - widgetWidth / 2 - squareSide / 2 )
          .attr( "y", (d) -> d.y - knobRadius )

        texts
          .attr( "dx", (d) -> d.x )
          .attr( "dy", (d) -> d.y + 5 )

        msgs
          .attr( "dx", (d) -> d.x  )
          .attr( "dy", (d) -> d.y - widgetHeight / 2 )

    node.call(force.drag)
    force.nodes(nodes).links links
    force.start()

  root = exports ? window
  root.runDpm = runDpm

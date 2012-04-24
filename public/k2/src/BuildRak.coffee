width = 720
height = 570
widgetWidth = 100
widgetHeight = 48
knobRadius = 12
squareSide = 18
color = d3.scale.category20()
nodes = [
    name: "YLT"
    group: 1
  ,
    name: "Compile"
    group: 3
  ,
    name: "Geocode"
    group: 5
  ,
    name: "RLFM"
    group: 7
  ,
    name: "EP"
    group: 9
  ,
    name: "MDRCV"
    group: 11
  ,
    name: "EP Viewer"
    group: 13
]

links = []

svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

link = svg.selectAll("line.link")
    .data(links)

node = svg.selectAll("g.node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
#    .attr("transform", (d, i) -> "translate(" + d.x + ", " + d.y + ")")

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
    .on "click", (d, i) ->
      fromSet = dag.to(d, i)
      d.predecessors = []
      fromSet.forEach (source) ->
        d.predecessors.push source.name
        links.push
          source: source.index
          target: d.index
          rak: "1"
      restart()

circles = node
    .append( "circle" )
    .attr( "class", "node" )
    .attr( "r", knobRadius )
    .style( "fill", (d) -> color d.group )
    .on( "click", (d, i) ->   dag.from d, i )

texts = node
    .append( "text" )
    .attr( "class", "node" )
    .text( (d) ->  d.name )

msgs = node
    .append( "text" )
    .attr( "class", "node status" )

force = d3.layout.force().
    charge(-320)
    .gravity(0.05)
    .linkDistance(widgetWidth)
    .size([ width, height ])

node.call(force.drag)

restart = ->
  force.start()
  link = svg.selectAll("line.link")
      .data(links)
    .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke-width", (d) ->  3  )
      .style("color", (d) -> color d.rak )
      .attr("x1", (d) -> d.source.x + widgetWidth / 2 + knobRadius )
      .attr("y1", (d) -> d.source.y )
      .attr("x2", (d) -> d.target.x - widgetWidth / 2 - squareSide / 2  )
      .attr("y2", (d) -> d.target.y )

force.on "tick", ->
    svg.selectAll("line.link")
      .attr( "x1", (d) -> d.source.x + widgetWidth / 2 + knobRadius )
      .attr( "y1", (d) -> d.source.y )
      .attr( "x2", (d) -> d.target.x - widgetWidth / 2 - squareSide / 2 )
      .attr( "y2", (d) -> d.target.y )

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

$("#buildpageref").on "click", ->
  $("#page").text("Build a workflow")

$("#runpageref").on "click",  ->
  $("#page").text("Run a workflow")
  runRak()

$("#dpmpageref").on "click",  ->
  $("#page").text("DPM: Refresh Portfolio Report")
  runDpm()

force.nodes(nodes).links links
restart()

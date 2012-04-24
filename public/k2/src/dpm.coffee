width = 960
height = 500

nodeWidth = 60
nodeHeight = 44

color = d3.scale.category20()

force = d3.layout.force()
    .charge(-240)
    .gravity(.03)
    .linkDistance(nodeWidth * 2)
    .size([width, height])

svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)

d3.json("dpm.json", (json) ->
  force
      .nodes(json.nodes)
      .links(json.links)
      .start()


  node = svg.selectAll("g.node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag)

  link = svg.selectAll("line.link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", (d) -> 4 )
      .style("stroke", (d) -> color d.value )

  node.each (d) ->
    d.fixed = (d.value is 'start' or d.value is 'end') if d.value?


  geom = node
      .insert("ellipse")
      .attr("opacity", .6)
      .attr("class", "node")
      .attr("rx", nodeWidth / 2 )
      .attr("ry", nodeHeight / 2 )
      .style("fill", (d) -> color d.group )

  node.append("title")
      .text((d) -> d.name)

  text = node.append("text")
      .attr("class", "node")
      .text( (d) -> d.name )

  force.on("tick", ->
    link.attr("x1", (d) -> d.source.x)
        .attr("y1", (d) -> d.source.y)
        .attr("x2", (d) -> d.target.x)
        .attr("y2", (d) -> d.target.y)

    geom.attr("cx", (d) -> d.x)
        .attr("cy", (d) -> d.y)

    text.attr( "dx", (d) -> d.x)
        .attr( "dy", (d) -> d.y)
  )
)
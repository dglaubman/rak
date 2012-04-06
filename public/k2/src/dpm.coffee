width = 960
height = 500

nodeWidth = 80
nodeHeight = 50

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

  link = svg.selectAll("line.link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", (d) -> 4 )
      .style("stroke", (d) -> color d.value )

  node = svg.selectAll("circle.node")
      .data(json.nodes)
    .enter().append("ellipse")
      .attr("class", "node")
      .attr("rx", nodeWidth / 2 )
      .attr("ry", nodeHeight / 2 )
      .style("fill", (d) -> color d.group )
      .call(force.drag)

  node.append("title")
      .text((d) -> d.name)

  force.on("tick", ->
    link.attr("x1", (d) -> d.source.x)
        .attr("y1", (d) -> d.source.y)
        .attr("x2", (d) -> d.target.x)
        .attr("y2", (d) -> d.target.y)

    node.attr("cx", (d) -> d.x)
        .attr("cy", (d) -> d.y)
   )
)
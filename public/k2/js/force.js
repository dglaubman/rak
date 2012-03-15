var width = 960,
    height = 500;

var widgetWidth = 110, 
    widgetHeight = 60, 
    knobRadius = 12, 
    squareSide = 18;

var color = d3.scale.category20();
var nodes = [
  { "name": "Upload",	"group": 1 }, 
  { "name": "Compile", 	"group": 3 }, 
  { "name": "Geocode",  "group": 5 }, 
  { "name": "Analyze",  "group": 7}, 
  { "name": "Report", 	"group": 9 }, 
  { "name": "Approve", 	"group": 11 } ];

var links = [];

var force = d3.layout.force()
    .charge(-320)
    .gravity(0.05)
    .linkDistance(widgetWidth)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll("line.link")
    .data(links);

var node = svg.selectAll("g.node")
    .data(nodes)
  .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ");"; })
    .call( force.drag );

var ellipses = node.append( "ellipse")
    .attr("class", "node")
    .attr("rx", widgetWidth / 2)
    .attr("ry", widgetHeight / 2)
    .style("fill", function(d) { return color(d.group); });

var rects = node.append( "rect")
    .attr("class", "node")
    .attr("height", squareSide)
    .attr("width", squareSide)
    .style("fill", function(d) { return color(d.group); });

rects
    .on("click", function(d,i) { 
        var fromSet = dag.to( d, i ); 
        fromSet.forEach( function(source) {
	    links.push({source: source.index, target: d.index, value: "1"});
       });
       restart();
     });

var circles = node.append( "circle" )
    .attr("class", "node")
    .attr("r", knobRadius)
    .style("fill", function(d) { return color(d.group); })
    .on("click", function(d,i) {
	return dag.from( d, i );
    });
 
var texts = node.append( "text" )
    .attr("class", "node")
    .text( function(d) { return d.name; });

force.on("tick", function() {
    svg.selectAll("line.link")
      .attr("x1", function(d) { return d.source.x + widgetWidth / 2 + knobRadius; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x - widgetWidth / 2 - knobRadius; })
      .attr("y2", function(d) { return d.target.y; });

    ellipses
     .attr("cx", function(d) { return d.x; } )
     .attr("cy", function(d) { return d.y; } );

    circles
     .attr("cx", function(d) { return d.x + widgetWidth / 2 + knobRadius / 2; } )
     .attr("cy", function(d) { return d.y; } );

    rects
     .attr("x", function(d) { return d.x - widgetWidth / 2 - squareSide / 2; } )
     .attr("y", function(d) { return d.y - knobRadius; } );

    texts
     .attr("dx", function(d) { return d.x; } )
     .attr("dy", function(d) { return d.y + 5; } );
  });

  force
     .nodes(nodes)
     .links(links);
  restart();

function restart() {
    force.start();
    
     link = svg.selectAll("line.link")
      .data(links).
     enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return 3; })
      .attr("x1", function(d) { return d.source.x + widgetWidth / 2 + knobRadius; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x - widgetWidth / 2 - knobRadius; })
      .attr("y2", function(d) { return d.target.y; });

   }


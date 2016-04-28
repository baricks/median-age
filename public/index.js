var width = 830;
var height = 380;

// D3 Projection
var projection = d3.geo.albersUsa()
  .translate([width/2, height/2])   
  .scale([800]);
        
// Define path generator
var path = d3.geo.path()               
   .projection(projection);
    
// Define linear scale for output
var color = d3.scale.linear()
    .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

var legendText = ["<83.0", "83.0-83.9", "84.0-84.9", "85.0+"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
        
// Append DIV for tooltip to SVG
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")    
    .style("opacity", 1);

// Load in the CSV by state
d3.csv("life-expectancy.csv", function(data) {
color.domain([3,2,1,0]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {
  
  // Grab State Name
  var dataState = data[i].state;
  
  // Grab code value 
  var dataValue = data[i].coder;

  // Grab average ages
  var dataAge = data[i].average;
  var dataFemale = data[i].female;
  var dataMale = data[i].male;
  
  // Find the corresponding state inside the GeoJSON
  for (var j = 0; j < json.features.length; j++)  {
    var jsonState = json.features[j].properties.name;
    if (dataState == jsonState) {
    
    // Copy the data value into the JSON
    json.features[j].properties.coder = dataValue;

    json.features[j].properties.average = dataAge;
    json.features[j].properties.male = dataMale;
    json.features[j].properties.female = dataFemale;

    // Stop looking through the JSON
    break;
    }
  }
}
    
// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
  .data(json.features)
  .enter()
  .append("path")
  .attr("d", path)
  .style("stroke", "#fff")
  .style("stroke-width", "1")
  .style("fill", function(d) {
  
  // Get data value
  var value = d.properties.coder;
  if (value) {
  
  //If value exists…
  return color(value);
  } else {
  
  //If value is undefined…
  return "rgb(122,198,93)";
  }
  })

d3.csv("life-expectancy.csv", function(data) {

  // var numDataAge = d.properties.average;
  // var numDataMale = d.properties.male;
  // var numDataFemale = d.properties.female;


  console.log(dataAge)

div.append("text")
  .data(data)
  .enter()

  .on("mouseover", function(d) {      
      div.transition()        
           .duration(200)      
           .style("opacity", .9);      
          div.text(data.average)
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY)+ "px");    
  })   

    // fade out tooltip on mouse out               
    .on("mouseout", function(d) {       
        div.transition()        
           .duration(500)      
           .style("opacity", 0);   
    });
  });
       
// Legend
var legend = d3.select("body").append("svg")
          .attr("class", "legend")
          .attr("width", 140)
          .attr("height", 160)
          .selectAll("g")
          .data(color.domain().slice().reverse())
          .enter()
          .append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);
    legend.append("text")
        .data(legendText)
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("font-size", 14)
          .text(function(d) { return d; });
  })
  });


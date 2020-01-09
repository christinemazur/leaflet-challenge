// Perform an API call to the USGS API to get earthquake information. Call createMarkers when complete
var queryURL = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
console.log(queryURL)
// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMap(data.features);
});

function createMap(earthQuakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "EarthQuakes": earthQuakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [0, 0],
    zoom: 2.5,
    layers: [lightmap, earthQuakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

  // Pull the "geometry" property off of response.data (will this work since the field name has a colon : ?)
  var geometry = response.data.geometry;

  // Initialize an array to hold quake markers
  var quakeMarkers = [];

  // Loop through the geometry array
  for (var index = 0; index < geometry.length; index++) {
    var geometry = geometry[index];

    // For each geometry, create a marker and bind a popup with the geometry's 
    var quakeMarker = L.marker([geometry])
      .bindPopup("<h3>" + geometry.Point + "<h3><h3>Coordinates: " + geometry.coordinates + "<h3>");

    // Add the marker to the quakeMarkers array
    quakeMarkers.push(quakeMarker);
  }

  // Create a layer group made from the quake markers array, pass it into the createMap function
  createMap(L.layerGroup(quakeMarkers));

  //create the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  	var div = L.DomUtil.create('div', 'info legend');
  	var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var color = ["#00ccbc","#90eb9d","#f9d057","#f29e2e","#e76818","#d7191c"];

  	// loop through our density intervals and generate a label with a colored square for each interval
  	for (var i = 0; i < grades.length; i++) {
  		div.innerHTML +=
  			'<p style="margin-left: 15px">' + '<i style="background:' + color[i] + ' "></i>' + '&nbsp;&nbsp;' + grades[i]+ '<\p>';
  	}

  	return div;
  };

  //Add the legend by default
  legend.addTo(myMap)

  //Overlay listener for adding
  myMap.on('overlayadd', function(a) {
    //Add the legend
    legend.addTo(myMap);
  });

  //Overlay listener for remove
  myMap.on('overlayremove', function(a) {
    //Remove the legend
    myMap.removeControl(legend);
  });

}




// var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// console.log (earthquakes_url)
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(magnitude) {
    return magnitude * 3;
};

var earthquake = new L.LayerGroup();

// 'mag' is the magnitude of the earthquake under 'properties'
//latlng gets the coordinates of the geojson point

d3.json(earthquake_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },
// show the 'time' and the 'title' when click circle
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquake);
    createMap(earthquake);
});

var faultline = new L.LayerGroup();


function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'lightorange'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'lightyellow'
    } else {
        return 'green'
    }
};


function createMap() {
   
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
    var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });
   
    var baseLayers = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    var overlays = {
        "Fault Lines": faultline,
        "Earthquakes": earthquake,
        
    };
//center on italy and zoom out to see entire globe
    var mymap = L.map('map-id', {
        center: [41.8719, 12.5674],
        zoom: 2.5,
        layers: [satellite, earthquake, faultline]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
 
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

         for (var i = 0; i < magnitude.length; i++) {
             div.innerHTML +=
             '<div class="color-box" style="background-color:' + Color(magnitude[i] + 1) + ';"></div> '+ 
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);


}
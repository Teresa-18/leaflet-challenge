// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(earthquakeData) { // *** earthquakeData is the DATA coming from up above's query ***

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeaturePrep(feature, layer) { // **** GRAB only what is needed from the DATA *****
    layer.bindPopup("<h3> Magnitude: " + feature.properties.mag +
      "</h3><hr><p> Depth: " + (feature.geometry.coordinates[2]) + "</p>" +
      "</hr><hr><p> Location: " + feature.properties.place + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, coordinates) {
      return L.circle(coordinates, {
      opacity: 1,
      fillOpacity: 0.75,
      color: "#000000",
      fillColor: depthColor(feature.geometry.coordinates[2]),
      radius: (feature.properties.mag) * 20000,
      stroke: true,
      weight: 0.5,
    });
  }, onEachFeature: onEachFeaturePrep
  });
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightMap,
    "Satellite Map": satelliteMap,
    "Outdoors Map": outdoorsMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [outdoorsMap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');

    var depths = [-10, 10, 30, 50, 70, 90];

    var labels = ['<strong>Earthquake Depth</strong><br>'];

    for (var i = 0; i< depths.length; i++) {
      div.innerHTML +=
      labels.push(
        '<i class="rect" style="background:' + depthColor(depths[i]+1) + '"></i>' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+'));
    }

      div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(myMap);
}
function depthColor(depth) {
  switch (true) {
    case depth > 90:
      return '#ff4000';
      break;
    case depth > 70:
      return '#ff8000';
      break;
    case depth > 50:
      return '#ffbf00';
      break;
    case depth > 30:
      return '#ffff00';
      break;
    case depth > 10:
      return '#bfff00';
    default:
      return '#80ff00'
  }
}



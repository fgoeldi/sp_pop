var map = L.map('map').setView([-23.534556, -46.588433], 10);

var info = L.control();

mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
landlink = '<a href="http://thunderforest.com/">Thunderforest</a>';
L.tileLayer(
    'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
        attribution: '&copy; '+mapLink+' Contributors & '+landlink,
        maxZoom: 15,
    }).addTo(map);

function getColor(d) {
  return d > 699935 ? '#800026' :
    d > 372782 ? '#BD0026' :
    d > 282239 ? '#E31A1C' :
    d > 163503 ? '#FC4E2A' :
    d > 118077 ? '#FD8D3C' :
    d > 79381 ? '#FEB24C' :
    d > 40665 ? '#FED976' :
    '#FFEDA0';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.POP_2000),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}




info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>SP Population</h4>' +  (props ?
        '<b>' + props.NOME + '</b><br />' + props.POP_2000 + ' people'
        : 'Hover over a state');
};

info.addTo(map);

geojson = L.geoJson(sp, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


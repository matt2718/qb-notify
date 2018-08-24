colorDefaults = {
    strokeColor: '#0052bb',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#0052bb',
    fillOpacity: 0.3
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 40.0, lng: -96.0},
        mapTypeId: 'roadmap'
    });

    [].forEach.call(
	document.getElementsByClassName('notify-state'),
	function(elem) { drawState(elem.dataset.state); }
    );

    [].forEach.call(
	document.getElementsByClassName('notify-circle'),
	function(elem) {
	    var radius = parseFloat(elem.dataset.radius);
	    // google maps accepts radius in meters, we need to convert
	    switch(elem.dataset.unit) {
	    case 'mi':
		radius *= 1609.3;
		break;
	    case 'ft':
		radius *= 0.3048;
		break;
	    case 'km':
		radius *= 1000.0;
		break;
	    default:
		radius *= 1.0;
	    }
	    
	    drawCircle(
		parseFloat(elem.dataset.lat),
		parseFloat(elem.dataset.lng),
		radius
	    );
	}
    );
}

function getJSON(url, callback) {
    // JSON XHR wrapper for convenience
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(xhr.response);
        }
    };
    xhr.send();
};

function drawPoly(coords) {
    var params = Object.assign({paths: coords}, colorDefaults);
    var polygon = new google.maps.Polygon(params);
    polygon.setMap(map);
}

function drawCircle(lat, lng, radius) {
    var params = Object.assign({
	center: {lat: lat, lng: lng},
        radius: radius
    }, colorDefaults);
    var circle = new google.maps.Circle(params);
    circle.setMap(map);
}

function drawState(abbr) {
    getJSON(document.location.origin + '/static/polygons/' + abbr + '.json',
	    drawPoly);
}

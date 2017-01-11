var cluster = 'eu';
var itineraryLanguage = 'EN';
var routingProfile = 'truckfast';
var alternativeRoutes = 0;

var baseLayers;
var routingControl;

// initialize the map
var map = L.map('map', {
	contextmenu: true,
	contextmenuWidth: 200,
	contextmenuItems: [
		{
			text: 'Add Waypoint At Start',
			callback: function (ev) {
				if (routingControl._plan._waypoints[0].latLng) {
					routingControl.spliceWaypoints(0, 0, ev.latlng);
				} else {
					routingControl.spliceWaypoints(0, 1, ev.latlng);
				}
			}
		}, {
			text: 'Add Waypoint At End',
			callback: function (ev) {
				if (routingControl._plan._waypoints[routingControl._plan._waypoints.length - 1].latLng) {
					routingControl.spliceWaypoints(routingControl._plan._waypoints.length, 0, ev.latlng);
				} else {
					routingControl.spliceWaypoints(routingControl._plan._waypoints.length - 1, 1, ev.latlng);
				}
			}
		}
	]
});

map.createPane('labels');
map.getPane('labels').style.zIndex = 500;
map.getPane('labels').style.pointerEvents = 'none';

// get the start and end coordinates for a cluster
var getPlan = function () {
	if (cluster.indexOf('hh') > -1) {
		return [
			L.latLng(53.55145062603612, 9.934816360473632),
			L.latLng(53.52796226132062, 9.84975814819336)
		];
	}
	if (cluster.indexOf('na') > -1) {
		return [
			L.latLng(40.71454, -74.00711),
			L.latLng(42.35867, -71.05672)
		];
	} else if (cluster.indexOf('au') > -1) {
		return [
			L.latLng(-33.86959, 151.20694),
			L.latLng(-35.3065, 149.12659)
		];
	} else { // 'eu'	
		return [
			L.latLng(48.8588, 2.3469),
			L.latLng(52.3546, 4.9039)
		];
	}
};

// returns a layer group for xmap back- and foreground layers
function getXMapBaseLayers(style) {
	var bg = L.tileLayer('https://s0{s}-xserver2-europe-eu-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}/' + style + '-labels' +
		'?xtok=' + token, {
			attribution: '<a target="_blank" href="http://www.ptvgroup.com">PTV</a>, TOMTOM',
			maxZoom: 22,
			subdomains: '124'
		});

	var fg = L.tileLayer('https://s0{s}-xserver2-europe-eu-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}/' + style + '-background-transport' +
		'?xtok=' + token, {
			attribution: '<a target="_blank" href="http://www.ptvgroup.com">PTV</a>, TOMTOM',
			maxZoom: 22,
			subdomains: '124',
			pane: 'shadowPane',
			zIndex: 1
		});

	return L.layerGroup([bg, fg]);
}

var setCluster = function () {
	if (routingControl) {
		map.removeControl(routingControl);
	}

	routingControl = L.Routing.control({
		plan: L.Routing.plan(getPlan(),
			{
				routeWhileDragging: false,
				routeDragInterval: 3000,
				createMarker: function (i, wp) {
					return L.marker(wp.latLng, {
						draggable: true,
						icon: L.icon.glyph({ glyph: String.fromCharCode(65 + i) })
					});
				},
				geocoder: L.Control.Geocoder.ptv({
					serviceUrl: 'https://xserver2-europe-eu-test.cloud.ptvgroup.com/services/rest/XLocate/experimental/locations/',
					token: token
				}),
				reverseWaypoints: true
			}),
		lineOptions: {
			styles: [
				// Shadow
				{ color: 'black', opacity: 0.8, weight: 11 },
				// Outline
				{ color: 'green', opacity: 0.8, weight: 8 },
				// Center
				{ color: 'orange', opacity: 1, weight: 4 }
			]
		},
		router: L.Routing.ptv({
			serviceUrl: 'https://xserver2-europe-eu-test.cloud.ptvgroup.com/services/rs/XRoute/experimental/',
			token: token, supportsHeadings: true,
			numberOfAlternatives: 0
		}),
		collapsible: true,
		routeWhileDragging: false,
		routeDragInterval: 3000,
		formatter: new L.Routing.Formatter({ roundingSensitivity: 1000 })
	}).addTo(map);

	routingControl.on('routingerror', function (e) {
		//		alert(e.error.message);
	});

	L.Routing.errorControl(routingControl).addTo(map);
	//	routingControl.hide();
};

// initalize the cluster
setCluster();
//map.setView([49, 8.4], 16);

// update ui
$('#clusterSelect').val(cluster);
$('#languageSelect').val(itineraryLanguage);
$('#routingProfile').val(routingProfile);
$('#alternativeRoutes').val(alternativeRoutes);

// add side bar
var sidebar = L.control.sidebar('sidebar').addTo(map);
//sidebar.open('home');

// add scale control
L.control.scale().addTo(map);

//map._panes.tileoverlayPane = map._createPane('leaflet-tile-pane', map._panes.overlayPane);
//map._panes.tileoverlayPane.style['pointer-events'] = 'none';

var empty = L.layerGroup([]);

var baseLayers = {
	"PTV gravelpit": getXMapBaseLayers('gravelpit'),
	"PTV sandbox": getXMapBaseLayers('sandbox'),
	"PTV silkysand": getXMapBaseLayers('silkysand').addTo(map),
	"Empty": empty
};


var truckAttributesLayer = L.TileLayer.clickableTiles(
	'https://s0{s}-xserver2-europe-eu-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}/' +
	'silkysand-background-transport-labels+PTV_TruckAttributes/json?xtok=' + token,
	{
		attribution: '<a target="_blank" href="http://www.ptvgroup.com">PTV</a>, TOMTOM',
		subdomains: '124',
		maxZoom: 22,
		zIndex: 1000,
		pane: 'shadowPane'
	});


L.control.layers(baseLayers, { "Truck Attributes": truckAttributesLayer },
	{ position: 'bottomleft', autoZIndex: false }).addTo(map);

// update the map cluster
var updateCluster = function () {
	cluster = $('#clusterSelect option:selected').val();
	updateParams(true);
};

// update the routing params
var updateParams = function (updateWayPoints) {
	itineraryLanguage = $('#languageSelect option:selected').val();
	routingProfile = $('#routingProfile option:selected').val();
	alternativeRoutes = $('#alternativeRoutes option:selected').val();

	if (updateWayPoints)
		routingControl.setWaypoints(getPlan());
	routingControl._router.options.numberOfAlternatives = 0;
	routingControl.route();
};

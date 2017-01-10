### Basic Setups for Map Widgets

xserverjs also supports templates to add an xMapServer-1 map to JavaScript widgets.

#### Leaflet Basic Setup (for 0.7 and 1.0)

[Demo](http://ptv-logistics.github.io/xserverjs/boilerplate/xmap-1/Leaflet.1.0.html)

The optimal configuration for xMapServer-1 is the use of the WMS adapter. For this purpose xserverjs contains the files `NonTiledLayer.js` and `NonTiledLayer.WMS.js` which you can add to your project:

```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"></script>
<script src="./NonTiledLayer.js"></script>
<script src="./NonTiledLayer.WMS.js"></script>
<script src="./token.js"></script>
<script>
    // initialize leaflet
    var map = new L.Map('map', {});

    // center Karlsruhe
    map.setView(new L.LatLng(49.01, 8.4), 16);

    // using the xServer WMS adapter
    var xMapWmsUrl = 'https://api-test.cloud.ptvgroup.com/WMS/WMS?xtok=' + token;
    var xMapTileUrl = 'https://api{s}-test.cloud.ptvgroup.com/WMS/GetTile/xmap-silkysand-bg/{x}/{y}/{z}.png';

    // on-premise
    // var xMapWmsUrl = 'http://localhost:50010/WMS/WMS;
    // var xMapTileUrl = 'localhost:50010/WMS/GetTile/xmap-silkysand-bg/{x}/{y}/{z}.png';

    var xMapAttribution = '<a href="http://www.ptvgroup.com">PTV<\/a>, TOMTOM';

    // add (tiled) background layer
    var background = L.tileLayer(xMapTileUrl, {
        maxZoom: 19,
        minZoom: 0,
        opacity: 1.0,
        noWrap: false,
        attribution: xMapAttribution,
        subdomains: '1234',
        zIndex: 1
    }).addTo(map);

    // add (non-tiled) label layer. Insert at tile pane
    var labels = new L.NonTiledLayer.WMS(xMapWmsUrl, {
        maxZoom: 19,
        minZoom: 0,
        opacity: 1.0,
        layers: 'xmap-silkysand-fg',
        format: 'image/png',
        transparent: true,
        attribution: xMapAttribution,
        pane: 'tilePane',
        zIndex:3
    }).addTo(map);
</script>
```
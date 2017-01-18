# leaflet-routing-machine for PTV xServer
This project shows how to use http://www.liedman.net/leaflet-routing-machine/ with PTV xServer.

[Demo](http://ptv-logistics.github.io/xserverjs/premium-samples/lrm-xserver/xserver-2/)

The additional classes required to use PTV xServer with leaflet-routing-machine:

## L.NonTiledLayer.WMS
Provides an implementation to support single-tile WMS layers for Leaflet, similar to L.TileLayer.WMS. This is required to add xMapServer content as Leaflet layer. See here for details: https://github.com/ptv-logistics/Leaflet.NonTiledLayer

## L.Control.Geocoder.Ptv
The PTV xLocate implementation of the geocoder for routing-machine.

Supported options:
* *serviceUrl* - The url for PTV xLocate. Default: ```'https://api.cloud.ptvgroup.com/xlocate/rs/XLocate/'```
* *token* - The token for xServer internet access. Default: ```''```
* *fixedCountry* - A country that can be predefined for single-field search. Default: ```''```

## L.Routing.Ptv
The PTV xRoute implementation of the router for routing-machine.

Supported options:
* *serviceUrl* - The url for PTV xRoute. Default: ```'https://api.cloud.ptvgroup.com/xroute/rs/XRoute/'```
* *token* - The token for xServer internet access. Default: ```''```
* *supportsHeadings* - indicates the back-end is a real xServer that supports heading informations. Default: ```true```
* *numberOfAlternatives* - Number of alternatives to calculate. Default: ```0```
* *beforeSend* - A delegate to manipulate the sent request. Default: ```null```
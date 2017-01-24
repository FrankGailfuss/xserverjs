/*! leaflet-xserver - v0.9.0 - 2017-01-23 */

!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b=b.L||(b.L={}),b=b.TileLayer||(b.TileLayer={}),b.ClickableTiles=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){(function(c){"use strict";var d="undefined"!=typeof window?window.L:"undefined"!=typeof c?c.L:null,e=a("corslite");d.TileLayer.ClickableTiles=d.TileLayer.extend({includes:d.Mixin.Events,initialize:function(a,b){d.TileLayer.prototype.initialize.call(this,a,b)},onAdd:function(a){this._resetQueue(),d.TileLayer.prototype.onAdd.call(this,a);var b=a._container;b.addEventListener("mousemove",d.bind(this._onMouseMove,this),!0),b.addEventListener("mousedown",d.bind(this._onMouseDown,this),!0),a._mapPane.addEventListener("click",d.bind(this._onClick,this),!0),a.addEventListener("click",d.bind(this._onMapClick,this),!1)},onRemove:function(a){this._resetQueue();var b=a._container;b.removeEventListener("mousemove",d.bind(this._onMouseMove,this),!0),b.removeEventListener("mousedown",d.bind(this._onMouseDown,this),!0),a._mapPane.removeEventListener("click",d.bind(this._onClick,this),!0),a.removeEventListener("click",d.bind(this._onMapClick,this),!1),d.TileLayer.prototype.onRemove.call(this,a)},maxConcurrentRequests:8,requestQueue:[],activeRequests:[],queueId:0,_setView:function(a,b,c,e){var f=Math.round(b);(void 0!==this.options.maxZoom&&f>this.options.maxZoom||void 0!==this.options.minZoom&&f<this.options.minZoom)&&(f=void 0);var g=this.options.updateWhenZooming&&f!==this._tileZoom;g&&this._resetQueue(),d.TileLayer.prototype._setView.call(this,a,b,c,e)},redraw:function(){this._resetQueue(),d.TileLayer.prototype.redraw.call(this)},_resetQueue:function(){this.requestQueue=[],this.queueId=this.queueId+1;for(var a=0;a<this.activeRequests.length;a++)this.activeRequests[a].abort();this.activeRequests=[]},runRequestQ:function(a,b,c){if(!c&&this.activeRequests.length>=this.maxConcurrentRequests)return void this.requestQueue.push({url:a,handleSuccess:b});var d=this,f=this.queueId,g=e(a,function(a,c){if(d.activeRequests.splice(d.activeRequests.indexOf(g),1),d.queueId==f&&d.requestQueue.length){var e=d.requestQueue.shift();d.runRequestQ(e.url,e.handleSuccess,!0)}b(a,c)},!0);this.activeRequests.push(g)},findElement:function(a,b){for(var c=d.DomEvent.getMousePosition(a,b),e=b._layers.length-1;e>=0;e--){var f=b._layers[e],g=Math.abs(f.pixelBoundingBox.right-f.pixelBoundingBox.left),h=Math.abs(f.pixelBoundingBox.top-f.pixelBoundingBox.bottom);if(f.referencePixelPoint.x-g/2<=c.x&&f.referencePixelPoint.x+g/2>=c.x&&f.referencePixelPoint.y-h/2<=c.y&&f.referencePixelPoint.y+h/2>=c.y)return f}return null},findElement:function(a,b){if(!b)return null;var c,e,f,g=Array.prototype.slice.call(b.getElementsByTagName("img"));for(c=0,e=g.length;c<e;c++){f=g[c];for(var h=d.DomEvent.getMousePosition(a,f),i=f._layers.length-1;i>=0;i--){var j=f._layers[i],k=Math.abs(j.pixelBoundingBox.right-j.pixelBoundingBox.left),l=Math.abs(j.pixelBoundingBox.top-j.pixelBoundingBox.bottom);if(j.referencePixelPoint.x-k/2<=h.x&&j.referencePixelPoint.x+k/2>=h.x&&j.referencePixelPoint.y-l/2<=h.y&&j.referencePixelPoint.y+l/2>=h.y)return j}}return null},_onMouseMove:function(a){!this._map||this._map.dragging._draggable._moving||this._map._animatingZoom||(this.findElement(a,this._container)?(a.preventDefault(),this._map._container.style.cursor="pointer",a.stopPropagation()):this._map._container.style.cursor="")},_onMouseDown:function(a){var b=this.findElement(a,this._container);if(b)return a.preventDefault(),a.stopPropagation(),!1},_onClick:function(a){var b=this.findElement(a,this._container);if(b){a.preventDefault();for(var c="",e=0;e<b.attributes.length;e++){var f=b.attributes[e];c=c.concat(f.key.replace(/[A-Z]/g," $&")+": "+f.value.replace("_"," ")+"<br>")}return d.popup().setLatLng(b.latLng).setContent(c.toLowerCase()).openOn(map),a.stopPropagation(),!1}},_onMapClick:function(a){var b=this.findElement(a.originalEvent,this._container);if(b){for(var c="",e=0;e<b.attributes.length;e++){var f=b.attributes[e];c=c.concat(f.key.replace(/[A-Z]/g," $&")+": "+f.value.replace("_"," ")+"<br>")}return d.popup().setLatLng(b.latLng).setContent(c.toLowerCase()).openOn(map),!1}},pixToLatLng:function(a,b){var c=Math.PI,e=2*c,f=e/Math.pow(2,a.z),g=-c+(a.x+b.x/256)*f,h=c-(a.y+b.y/256)*f;return d.latLng(360/Math.PI*(Math.atan(Math.exp(h))-Math.PI/4),180/Math.PI*g)},createTile:function(a,b){var c=document.createElement("img");d.DomEvent.on(c,"load",d.bind(this._tileOnLoad,this,b,c)),d.DomEvent.on(c,"error",d.bind(this._tileOnError,this,b,c)),this.options.crossOrigin&&(c.crossOrigin=""),c.alt="",c.setAttribute("role","presentation");var e=this.getTileUrl(a);return c._map=this._map,c._layers=[],this.runRequestQ(e,d.bind(function(b,d){if(this._map){if(b)return void(c.src="");var e=JSON.parse(d.responseText),f={iVBOR:"data:image/png;base64,",R0lGO:"data:image/gif;base64,","/9j/4":"data:image/jpeg;base64,",Qk02U:"data:image/bmp;base64,"},g=e.image;if(c.src=f[g.substr(0,5)]+g,e.features)for(var h=e.features,i=0;i<h.length;i++){var j=h[i];j.latLng=this.pixToLatLng(a,j.referencePixelPoint),c._layers.push(j)}}},this)),c}}),d.TileLayer.clickableTiles=function(a,b){return new d.TileLayer.ClickableTiles(a,b)},b.exports=d.TileLayer.ClickableTiles}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{corslite:2}],2:[function(a,b,c){function d(a,b,c){function d(a){return a>=200&&a<300||304===a}function e(){void 0===h.status||d(h.status)?b.call(h,null,h):b.call(h,h,null)}var f=!1;if("undefined"==typeof window.XMLHttpRequest)return b(Error("Browser not supported"));if("undefined"==typeof c){var g=a.match(/^\s*https?:\/\/[^\/]*/);c=g&&g[0]!==location.protocol+"//"+location.hostname+(location.port?":"+location.port:"")}var h=new window.XMLHttpRequest;if(c&&!("withCredentials"in h)){h=new window.XDomainRequest;var i=b;b=function(){if(f)i.apply(this,arguments);else{var a=this,b=arguments;setTimeout(function(){i.apply(a,b)},0)}}}return"onload"in h?h.onload=e:h.onreadystatechange=function(){4===h.readyState&&e()},h.onerror=function(a){b.call(this,a||!0,null),b=function(){}},h.onprogress=function(){},h.ontimeout=function(a){b.call(this,a,null),b=function(){}},h.onabort=function(a){b.call(this,a,null),b=function(){}},h.open("GET",a,!0),h.send(null),f=!0,h}"undefined"!=typeof b&&(b.exports=d)},{}]},{},[1])(1)});
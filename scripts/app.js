!function(a){"use strict";function b(){a.querySelector("esri-search").extent=esri.geometry.webMercatorToGeographic(map.extent)}var c;dojo.addOnLoad(function(){window.map=new esri.Map("map",{center:[-56.049,38.485],zoom:3,basemap:"gray"}),map.on("extent-change",b),c=esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,new dojo.Color([255,255,255]),1),new dojo.Color([93,173,221,.1]))})}(wrap(document));

(function(document) {
  'use strict';

  /**
   * Simple as possible map that auto-searches on pan/zoom
   */

  var defaultSym;

  dojo.addOnLoad(function(){
    window.map = new esri.Map('map', {
      center: [-56.049, 38.485],
      zoom: 3,
      basemap: 'gray'
    });
    map.on('extent-change', onExtentChange);

    defaultSym = esri.symbol.SimpleFillSymbol(
      esri.symbol.SimpleFillSymbol.STYLE_SOLID,
      new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,255]), 1),
      new dojo.Color([93,173,221,0.1])
    );
  });

  function onExtentChange () {
    document.querySelector('esri-search').extent = esri.geometry.webMercatorToGeographic(map.extent);
  }

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));

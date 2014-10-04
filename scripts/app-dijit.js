(function(document) {
  'use strict';

  /**
   * Simple as possible map that auto-searches on pan/zoom
   */
  require([
    'esri/map',

    'widgets/OpenDataSearch',
    'dojo/domReady!'
  ], function(
    Map,
    OpenDataSearch
  ) {

    var map = new Map('map', {
      center: [-56.049, 38.485],
      zoom: 4,
      basemap: 'gray'
    });

    // init widget w/ ref to map
    new OpenDataSearch({
      map: map
    }).placeAt('searchPanel');

  });

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));

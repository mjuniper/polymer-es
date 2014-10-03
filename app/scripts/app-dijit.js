
(function(document) {
  'use strict';


  /**
   * Simple as possible map that auto-searches on pan/zoom
   */
  require(['widgets/EsriSearchSummary'], function(EsriSearchSummary) {

    var defaultSym, selectionSym, extentsLayer, infoTemplate;
    var summaryWidget;

    dojo.addOnLoad(function(){

      summaryWidget = new EsriSearchSummary({}, dojo.byId('summary'));
      window.map = new esri.Map('map', {
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: 'gray'
      });

      map.on('load', onLoad);
      map.on('extent-change', onExtentChange);

      defaultSym = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,255]), 1),
        new dojo.Color([93,173,221,0.1])
      );

      selectionSym = esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,255]), 2),
        new dojo.Color([93,173,221])
      );

      infoTemplate = new esri.InfoTemplate('${title}', '${*}');
    });

    function onLoad () {
      extentsLayer = new esri.layers.GraphicsLayer();
      map.addLayer(extentsLayer);
      document.querySelector('esri-search').addEventListener('esri:search:complete', onSearchComplete);
      document.querySelector('esri-search-results').addEventListener('esri:search-result:item-clicked', zoomToExtent);
      document.querySelector('esri-search-results').addEventListener('esri:search-result:item-mouseover', hilightExtent);
      document.querySelector('esri-search-results').addEventListener('esri:search-result:item-mouseout', unhilightExtent);
    }

    function getGraphicById (id) {
      var graphic;
      extentsLayer.graphics.every(function (g) {
        if (id == g.attributes.id) {
          graphic = g;
          return false;
        }
        return true;
      });

      return graphic;
    }

    function hilightExtent (evt) {
      var graphic = getGraphicById(evt.detail.id);

      if (graphic) {
        var newGraphic = new esri.Graphic(graphic.geometry, selectionSym, graphic.attributes, infoTemplate);
        map.graphics.add(newGraphic);

        console.debug('added hilight graphic: ' + graphic.attributes.id);
        console.debug(map.extent.intersects(graphic.geometry) != null);
      }
    }

    function unhilightExtent (evt) {
      map.graphics.clear();
    }

    function zoomToExtent (evt) {
      console.debug('in zoomToExtent');
      var graphic = getGraphicById(evt.detail.id);
      if (graphic) {
        //console.debug('found graphic');
        if (graphic._extent) { console.debug('graphic has extent'); }
        //console.debug('setting extent');
        map.setExtent(graphic._extent, true);

        // map.infoWindow.setContent(graphic.getContent());
        // map.infoWindow.setTitle(graphic.getTitle());
        // var screenPoint = esri.geometry.toScreenPoint(map.extent, map.width, map.height, graphic.geometry.getCenter());
        // map.infoWindow.show(screenPoint, map.getInfoWindowAnchor(screenPoint));
      }
    }

    function onExtentChange () {
      document.querySelector('esri-search').extent = esri.geometry.webMercatorToGeographic(map.extent);
    }

    function onSearchComplete (evt) {
      showResults(evt.detail);
    }

    function showResults(response){
      extentsLayer.clear();

      var extentWgs84, extent, graphic;
      if(response.hits){
        response.hits.forEach(function(hit){
          extentWgs84 = new esri.geometry.Extent({
            xmin: hit._source.min_x,
            ymin: hit._source.min_y,
            xmax: hit._source.max_x,
            ymax: hit._source.max_y,
            spatialReference: { wkid: 4326 }
          });
          extent = esri.geometry.geographicToWebMercator(extentWgs84);
          graphic = new esri.Graphic(extent, defaultSym, hit._source, infoTemplate);
          extentsLayer.add(graphic);

        });
      }
    }


  });


// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));

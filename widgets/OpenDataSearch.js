/* jshint strict: false, camelcase: false */
/* global define */
define([
  'dojo/text!./templates/OpenDataSearch.html',

  'dojo/_base/declare',

  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'esri/InfoTemplate',
  'esri/layers/GraphicsLayer',
  'esri/graphic',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/Color',
  'esri/geometry/Extent',
  'esri/geometry/webMercatorUtils'
], function(
  template,

  declare,

  _WidgetBase,
  _TemplatedMixin,

  InfoTemplate, GraphicsLayer, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color, Extent, webMercatorUtils
) {

  function getGraphicById (layer, id) {
    var graphic;
    layer.graphics.every(function (g) {
      if (id === g.attributes.id) {
        graphic = g;
        return false;
      }
      return true;
    });

    return graphic;
  }

  return declare([_WidgetBase, _TemplatedMixin], {
    // description:
    //    Search for open data

    templateString: template,
    baseClass: 'open-data-search',

    // Properties to be sent into constructor

    postCreate: function() {
      // summary:
      //    set up default symbols and info template
      // tags:
      //    private
      this.defaultSym = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID, new Color([255,255,255]), 1),
        new Color([93,173,221,0.1])
      );

      this.selectionSym = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID, new Color([255,255,255]), 2),
        new Color([93,173,221])
      );
      this.infoTemplate = new InfoTemplate('${title}', '${*}');

      this.setupConnections();

      this.inherited(arguments);
    },

    setupConnections: function() {
      // summary:
      //    wire events, and such
      //
      this.map.on('load', this.onLoad.bind(this));
      this.map.on('extent-change', this.onExtentChange.bind(this));
    },

    onLoad: function() {
      this.extentsLayer = new GraphicsLayer();
      this.map.addLayer(this.extentsLayer);
      document.querySelector('esri-search').addEventListener('esri:search:complete', this.onSearchComplete.bind(this));
      document.querySelector('esri-search-results').addEventListener('esri:search-result:item-clicked', this.zoomToExtent.bind(this));
      document.querySelector('esri-search-results').addEventListener('esri:search-result:item-mouseover', this.hilightExtent.bind(this));
      document.querySelector('esri-search-results').addEventListener('esri:search-result:item-mouseout', this.unhilightExtent.bind(this));
    },

    hilightExtent: function (evt) {
      var graphic = getGraphicById(this.extentsLayer, evt.detail.id);

      if (graphic) {
        var newGraphic = new Graphic(graphic.geometry, this.selectionSym, graphic.attributes/*, this.infoTemplate*/);
        this.map.graphics.add(newGraphic);

        console.debug('added hilight graphic: ' + graphic.attributes.id);
        console.debug(this.map.extent.intersects(graphic.geometry) !== null);
      }
    },

    unhilightExtent: function () {
      this.map.graphics.clear();
    },

    zoomToExtent: function (evt) {
      console.debug('in zoomToExtent');
      var graphic = getGraphicById(this.extentsLayer, evt.detail.id);
      if (graphic) {
        //console.debug('found graphic');
        if (graphic._extent) { console.debug('graphic has extent'); }
        //console.debug('setting extent');
        this.map.setExtent(graphic._extent, true);

        // this.map.infoWindow.setContent(graphic.getContent());
        // this.map.infoWindow.setTitle(graphic.getTitle());
        // var screenPoint = esri.geometry.toScreenPoint(this.map.extent, this.map.width, this.map.height, graphic.geometry.getCenter());
        // this.map.infoWindow.show(screenPoint, this.map.getInfoWindowAnchor(screenPoint));
      }
    },

    onExtentChange: function () {
      document.querySelector('esri-search').extent = webMercatorUtils.webMercatorToGeographic(this.map.extent);
    },

    onSearchComplete: function (evt) {
      this.showResults(evt.detail);
    },

    showResults: function (response){
      this.extentsLayer.clear();

      var extentWgs84, extent, graphic;
      if(response.hits){
        response.hits.forEach(function(hit){
          extentWgs84 = new Extent({
            xmin: hit._source.min_x,
            ymin: hit._source.min_y,
            xmax: hit._source.max_x,
            ymax: hit._source.max_y,
            spatialReference: { wkid: 4326 }
          });
          extent = webMercatorUtils.geographicToWebMercator(extentWgs84);
          graphic = new Graphic(extent, this.defaultSym, hit._source/*, this.infoTemplate*/);
          this.extentsLayer.add(graphic);

        }, this);
      }
    }

  });
});

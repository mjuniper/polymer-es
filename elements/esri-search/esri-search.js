(function () {
  'use strict';

  Polymer({

    searchEl: 'esri-search-field',
    url: 'http://testing-qa-es-public-58843862.us-east-1.elb.amazonaws.com/opendataqa.arcgis.com_datasets_production_20140925181622853/',
    size: 10,

    ready: function () {
      var searchField = document.querySelector(this.searchEl);
      searchField.addEventListener('esri:search:before-start', this.search.bind(this));
    },

    search: function (evt) {
      this.searchString = evt.detail;
      this.$.ajax.go();
      this.fire('esri:search:start', this.searchString);
    },

    resultsChanged: function (oldVal) {
      var results = this.results.hits;
      results.searchString = this.searchString;
      results.size = this.size;
      this.fire('esri:search:complete', this.results.hits);
    }

  });

})();

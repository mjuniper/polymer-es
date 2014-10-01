(function () {
  'use strict';

  Polymer({

    searchEl: 'esri-search-field',
    url: 'http://testing-qa-es-public-58843862.us-east-1.elb.amazonaws.com/opendataqa.arcgis.com_datasets_production_20140925181622853/',
    size: 20,

    ready: function () {
      var searchField = document.querySelector(this.searchEl);
      searchField.addEventListener('esri:search:before-start', this.search.bind(this));
    },

    search: function (evt) {
      this.searchString = evt.detail;
      window.performance.mark('esri:search:start');
      this.$.ajax.go();
      this.fire('esri:search:start', this.searchString);
    },

    onResponse: function () {
      window.performance.mark('esri:search:response');
      window.performance.measure('esri-search-elapsed', 'esri:search:start', 'esri:search:response');

      var measure = window.performance.getEntriesByName('esri-search-elapsed')[0];
      this.searchElapsed = measure.duration;

      window.performance.clearMarks();
      window.performance.clearMeasures();
    },

    resultsChanged: function (oldVal) {
      var results = this.results.hits;
      results.searchString = this.searchString;
      results.size = this.size;
      results.took = this.results.took;
      results.totalTime = this.searchElapsed;
      this.fire('esri:search:complete', this.results.hits);
    }

  });

})();

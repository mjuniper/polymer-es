(function () {
  'use strict';

  Polymer({

    searchEl: 'esri-search-field',
    url: 'http://testing-qa-es-public-58843862.us-east-1.elb.amazonaws.com/demo_items/',
    size: 20,
    extent: null,

    ready: function () {
      this.searchField = document.querySelector(this.searchEl);
      this.searchField.addEventListener('esri:search:before-start', this.onSearchStart.bind(this));
    },

    onSearchStart: function (evt) {
      this.searchString = evt.detail;
    },

    searchStringChanged: function () {
      this.search();
    },

    search: function () {
      this.$.ajax.url = this.constructUrl();
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

    extentChanged: function (extent) {
      //set extent on searchEl so subsequent autocompletes will use the extent
      this.searchField.extent = extent;

      //trigger a search
      if (this.searchString) {
        this.search();  
      }
    },

    constructUrl: function () {
      var self = this;
      var searchObj = {
        query: {
          dis_max: {
            queries: [
              {
                match: {
                  title: {
                    query: self.searchString,
                    operator: 'and',
                    boost: 1
                  }
                }
              },
              {
                match: {
                  tags: {
                    query: self.searchString,
                    operator: 'and',
                    boost: 1
                  }
                }
              }
          
            ]
          }
        },
        filter: { 
          range : {
                min_y : {'gte': self.extent.ymin},
                max_y : {'lte': self.extent.ymax},
                min_x : {'gte': self.extent.xmin},
                max_x : {'lte': self.extent.xmax}
             }

        },
        size: self.size,
        from: 0,
        _source: ['title', 'name','description','id','tags','min_y','min_x','max_y','max_x']
      };

      return this.url + '_search?source=' + JSON.stringify(searchObj);
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

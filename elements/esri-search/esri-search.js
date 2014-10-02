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

    resultsChanged: function (oldVal) {
      if (this.results) {
        var results = this.results.hits;
        results.searchString = this.searchString;
        results.size = this.size;
        results.took = this.results.took;
        results.totalTime = this.searchElapsed;
        this.fire('esri:search:complete', this.results.hits);
      }
    },

    constructUrl: function () {
      var self = this;

      //clone it
      var searchObj = JSON.parse(JSON.stringify(this.searchObj));

      //add searchString
      searchObj.query.dis_max.queries.forEach(function (item) {
        if (item.match.title) {
          item.match.title.query = self.searchString;  
        }
        if (item.match.tags) {
          item.match.tags.query = self.searchString;  
        }
      });

      //add extent if present
      if (this.extent) {
        searchObj.filter = {
          range : {
              min_y : {'gte': this.extent.ymin},
              max_y : {'lte': this.extent.ymax},
              min_x : {'gte': this.extent.xmin},
              max_x : {'lte': this.extent.xmax}
            }
          }
      }

      //add size
      searchObj.size = this.size;

      //construct the url and return it
      return this.url + '_search?source=' + JSON.stringify(searchObj);
    },

    searchObj: {
      query: {
        dis_max: {
          queries: [
            {
              match: {
                title: {
                  query: '',
                  operator: 'and',
                  boost: 1
                }
              }
            },
            {
              match: {
                tags: {
                  query: '',
                  operator: 'and',
                  boost: 1
                }
              }
            }
        
          ]
        }
      },
      from: 0,
      _source: ['title', 'name','description', 'snippet', 'type','id','tags','min_y','min_x','max_y','max_x']
    }

  });

})();

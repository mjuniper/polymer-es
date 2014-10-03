(function () {
  'use strict';

  Polymer({

    autofocus: true,
    placeholder: 'Search for Open Data',
    searchString: '',
    searchEl: 'esri-search',
    extent: null,

    domReady: function () {
      //var url = document.querySelector(this.searchEl).url + '_search?size=5&q=tags:~QUERY~*%20title:~QUERY~*&_source_include=title,tags';
      var url = document.querySelector(this.searchEl).url;// + '_search';//?source={"query":{"dis_max":{"queries":[{"match":{"title":{"query":"~QUERY~","operator":"and","boost":1,"analyzer":"od_autocomplete"}}},{"match":{"tags":{"query":"~QUERY~","operator":"and","boost":1,"analyzer":"od_autocomplete"}}}]}},"size":10,"from":0,"_source":["title","tags","name"]}';
      this.initTypeahead(url);
    },

    onSubmit: function (e) {
      //this causes an apparently inconsequential script error
      e.preventDefault();
      this.fire('esri:search:before-start', this.searchString);
      this.typeahead.typeahead('close');
    },

    onTypeaheadSelected: function (evt, suggestion) {
      //this.searchString = suggestion.fields.title[0];
      this.searchString = this.typeahead.typeahead('val');
      this.fire('esri:search:before-start', this.searchString);
    },

    // getTypeaheadUrl: function (url, query) {
    //   url = url.replace(/~QUERY~/gi, query);
    //   return url;
    // },

    initBloodhound: function (url) {
      var self = this;
      var bloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: url,
          rateLimitWait: 150,
          replace: self.getTypeaheadUrl.bind(self),
          filter: function(response) {
            return response.hits.hits;
          }
        }
      });

      bloodhound.initialize();

      return bloodhound;
    },

    initTypeahead: function (url) {
      var opts = {
        highlight: true,
        minLength: 3,
        hint: false
      };

      var bloodhound = this.initBloodhound(url);

      var datasets = {
        name: 'datasets',
        displayKey: function(item) {
          return item._source.title;
        },
        templates: {
          empty: '<div class="empty-message">No datasets found.</div>'
        },
        source: bloodhound.ttAdapter()
      };

      this.typeahead = $(this.$.search).typeahead(opts, datasets).on('typeahead:selected', this.onTypeaheadSelected.bind(this));
    },

    getTypeaheadUrl: function (url, query) {
      //clone it
      var searchObj = JSON.parse(JSON.stringify(this.searchObj));

      //add searchString
      searchObj.query.filtered.query.dis_max.queries.forEach(function (item) {
        if (item.match.title) {
          item.match.title.query = query;  
        }
        if (item.match.tags) {
          item.match.tags.query = query;  
        }
      });

      //add extent if present
      if (this.extent) {
        var ext = this.extent;
        searchObj.query.filtered.filter = {
          bool: { 
            must: [
              { range: { min_y: { gte: ext.ymin, lte: ext.ymax } } },
              { range: { max_y: { lte: ext.ymax, gte: ext.ymin } } },
              { range: { min_x: { gte: ext.xmin, lte: ext.xmax } } },
              { range: { max_x: { lte: ext.xmax, gte: ext.xmin } } }
            ]
          }
        }
      }

      //add size
      searchObj.size = this.size;

      //construct the url and return it
      return url + '_search?source=' + JSON.stringify(searchObj);
    },

    searchObj: {
      query: {
        filtered: {
          query: {
              dis_max: {
                queries: [
                  {
                    match: {
                      title: {
                        query: '',
                        operator: 'and',
                        boost: 1,
                        analyzer: 'od_autocomplete'
                      }
                    }
                  },
                  {
                    match: {
                      tags: {
                        query: '',
                        operator: 'and',
                        boost: 1,
                        analyzer: 'od_autocomplete'
                      }
                    }
                  }
                ]
              }
            },
        }
      },
      from: 0,
      size: 10,
      _source: ['title', 'snippet', 'type','id','min_y','min_x','max_y','max_x']
    }

  });

})();
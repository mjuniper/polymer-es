(function () {
  'use strict';

  Polymer({

    searchEl: 'esri-search',
    spinner: true,
    showTiming: false,

    domReady: function () {
      var searchComponent = document.querySelector(this.searchEl);
      searchComponent.addEventListener('esri:search:start', this.showLoading.bind(this));
      searchComponent.addEventListener('esri:search:complete', this.handleResults.bind(this));
    },

    showLoading: function (evt) {
      if (this.spinner) {
        this.$.spinner.active = true;
      }
    },

    handleResults: function (evt) {
      this.results = evt.detail;
      this.async(function () { this.$.spinner.active = false; }, null, 500);
    },

    round: function (num) {
      return Math.round(num, 10);
    }

  });

})();

(function () {
  'use strict';

  Polymer({
    resultsEl: 'esri-search-results',
    spinner: false,

    created: function () {
      this.item = {};
    },

    ready: function () {
      var resultsComponent = document.querySelector(this.resultsEl);
      resultsComponent.addEventListener('esri:search-result:item-clicked', this.handleItem.bind(this));
    },

    showLoading: function (evt) {
      if (this.spinner) {
        this.$.spinner.active = true;
      }
    },

    handleItem: function (evt) {
      this.item = evt.detail;
      this.async(function () { this.$.spinner.active = false; }, null, 500);
    }
  });

})();
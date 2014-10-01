(function () {
  'use strict';

  Polymer({

    created: function () {
      this.item = {};
    },

    onItemClick: function (evt) {
      this.fire('esri:search-result:item-clicked', this.item._source);
    },

    stripHtml: function (html) {
      html = html || '';
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }

  });

})();

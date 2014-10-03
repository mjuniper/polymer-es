(function () {
  'use strict';

  Polymer({

    created: function () {
      this.item = {};
    },

    onItemClick: function (evt) {
      this.fire('esri:search-result:item-clicked', this.item._source);
    },

    onMouseOver: function (evt) {
      evt.preventDefault();
      this.fire('esri:search-result:item-mouseover', this.item._source);
    },

    onMouseOut: function (evt) {
      evt.preventDefault();
      this.fire('esri:search-result:item-mouseout', this.item._source);
    },

    stripHtml: function (html) {
      html = html || '';
      html = (html === 'null') ? '' : html;
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }

  });

})();

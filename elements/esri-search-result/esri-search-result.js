(function () {
  'use strict';

  Polymer({

    showDefault: true,

    created: function () {
      this.item = {};
    },

    ready: function() {
      //based on http://stackoverflow.com/questions/26125308/how-to-inject-template-into-polymer-component-by-providing-it-as-element-conte
      var template = document.querySelector('template#' + this.itemTemplate);
      if (template) {
        // Allow Polymer expressions in the template's {{}}.
        if (!template.bindingDelegate) {
          template.bindingDelegate = this.element.syntax;
        }

        this.$['result-item-container'].appendChild(template.createInstance(this));
        //this.injectBoundHTML(template.createInstance(this), this.$['result-item-container']);
        
        this.showDefault = false;
      }
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

define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./EsriSearchSummary.html'
], function(declare, _WidgetBase, _TemplatedMixin, template) {
  'use strict';

  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

  });
});

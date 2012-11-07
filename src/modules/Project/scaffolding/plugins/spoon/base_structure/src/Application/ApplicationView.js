define([
    'spoon',
    'doT',
    'jquery',
    'text!./assets/tmpl/main.html',
    'css!./assets/css/main.css'
], function (spoon, doT, $, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: 'ApplicationView',

        _element: 'div#app',
        _template: doT.template(tmpl)
    });
});
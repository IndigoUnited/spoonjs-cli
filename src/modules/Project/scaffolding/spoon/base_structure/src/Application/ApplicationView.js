define([
    'spoon',
    'doT',
    'jquery',
    'text!./assets/tmpl/app.html',
    'css!./assets/css/app.css'
], function (spoon, doT, $, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: 'ApplicationView',

        _element: 'div#app',
        _template: doT.template(tmpl)
    });
});
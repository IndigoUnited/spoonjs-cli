define([
    'spoon',
    'handlebars',
    'jquery',
    'text!./assets/tmpl/app.html',
    'css!./assets/css/app.css'
], function (spoon, Handlebars, $, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: 'ApplicationView',

        _element: 'div#app',
        _template: Handlebars.compile(tmpl)
    });
});
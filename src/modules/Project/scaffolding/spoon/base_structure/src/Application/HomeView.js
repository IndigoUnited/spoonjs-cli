define([
    'spoon',
    'handlebars',
    'jquery',
    'text!./assets/tmpl/home.html',
    'css!./assets/css/home.css'
], function (spoon, Handlebars, $, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: 'HomeView',

        _template: Handlebars.compile(tmpl)
    });
});
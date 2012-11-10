define([
    'spoon',
    'doT',
    'text!./assets/tmpl/base.html',
    'css!./assets/css/main.css'
], function (spoon, doT, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: '{{name}}View',

        _template: doT.template(tmpl)
    });
});
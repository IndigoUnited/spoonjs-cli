define([
    'spoon',
    '{{baseLibrary}}',
    '{{templateLibrary}}',
    'text!./assets/tmpl/app.html',
    'css!./assets/css/app.css'
], function (spoon, {{baseLibraryVar}}, {{templateLibraryVar}}, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: 'ApplicationView',

        _element: 'div#app',
        _template: {{templateLibraryVar}}.{{templateLibraryCompileFunc}}(tmpl)
    });
});
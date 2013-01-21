define([
    'spoon',
    '{{baseLibrary}}',
    '{{templateLibrary}}',
    'text!./assets/tmpl/home.html',
    'css!./assets/css/home.css'
], function (spoon, {{baseLibraryVar}}, {{templateLibraryVar}}, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: 'HomeView',

        _template: {{templateLibraryVar}}.{{templateLibraryCompileFunc}}(tmpl)
    });
});
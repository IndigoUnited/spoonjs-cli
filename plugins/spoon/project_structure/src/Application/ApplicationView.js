define([
    'spoon/View',
    '{{baseLibrary}}',
    '{{templateLibrary}}',
    'text!./assets/tmpl/app.html',
    'css!./assets/css/app.css'
], function (View, {{baseLibraryVar}}, {{templateLibraryVar}}, tmpl) {

    'use strict';

    return View.extend({
        $name: 'ApplicationView',

        _element: 'div#app',
        _template: {{templateLibraryVar}}.{{templateLibraryCompileFunc}}(tmpl)
    });
});
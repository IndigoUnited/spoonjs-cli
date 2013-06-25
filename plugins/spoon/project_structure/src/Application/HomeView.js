define([
    'spoon/View',
    '{{baseLibrary}}',
    '{{templateLibrary}}',
    'text!./assets/tmpl/home.html',
    'css!./assets/css/home.css'
], function (View, {{baseLibraryVar}}, {{templateLibraryVar}}, tmpl) {

    'use strict';

    return View.extend({
        $name: 'HomeView',

        _template: {{templateLibraryVar}}.{{templateLibraryCompileFunc}}(tmpl)
    });
});

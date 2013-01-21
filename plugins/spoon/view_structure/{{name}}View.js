define([
    'spoon',
    '{{baseLibrary}}',
    '{{templateLibrary}}',
    'text!./assets/tmpl/{{underscoredName}}.html',
    'css!./assets/css/{{underscoredName}}.css'
], function (spoon, {{baseLibraryVar}}, {{templateLibraryVar}}, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: '{{name}}View',

        _template: {{templateLibraryVar}}.{{templateLibraryCompileFunc}}(tmpl)
        /*_events: {
            'click .btn': '_onBtnClick'
        },*/

        /**
         * {@inheritDoc}
         */
        /*render: function (data) {
            // By default, the render function already
            // renders the _template with the passed data
            this.$super(data);

            // Do other things here

            return this;
        },*/

        /**
         * Handles the button click event.
         *
         * @param {Event} event The event
         */
        /*_onBtnClick: function (event) {
            this._upcast('btn-click');
        },*/

        /**
         * {@inheritDoc}
         */
        /*_onDestroy: function () {
            // Dispose any additional resources here

            this.$super();
        }*/
    });
});
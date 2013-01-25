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
            // Cancel timers and other stuff here
            // Note that linked child views/controllers are automatically destroyed
            // when this view is destroyed
            // The view element is also destroyed, clearing all the events and other stuff
            // from its element and its descendants
            this.$super();
        }*/
    });
});
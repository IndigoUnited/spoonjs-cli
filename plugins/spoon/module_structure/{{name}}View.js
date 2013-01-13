define([
    'spoon',
    'jquery',
    'handlebars',
    'text!./assets/tmpl/{{hyphenated_name}}.html',
    'css!./assets/css/{{hyphenated_name}}.css'
], function (spoon, $, Handlebars, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: '{{name}}View',

        _template: Handlebars.compile(tmpl)
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
        }*/

        /**
         * Handles the button click event.
         *
         * @param {Event} event The event
         */
        /*_onBtnClick: function (event) {
            this._upcast('btn-click');
        }*/
    });
});
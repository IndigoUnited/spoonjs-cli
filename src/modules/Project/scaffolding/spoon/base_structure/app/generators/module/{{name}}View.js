define([
    'spoon',
    'doT',
    'text!./assets/tmpl/{{hyphenated-name}}.html',
    'css!./assets/css/{{hyphenated-name}}.css'
], function (spoon, doT, tmpl) {

    'use strict';

    return spoon.View.extend({
        $name: '{{name}}View',

        _template: doT.template(tmpl)
        /*_events: {
            'click .btn': '_onBtnClick'
        },*/

        /**
         * {@inheritDoc}
         */
        /*render: function (data) {
            this.$super(data);

            // Do other things here
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
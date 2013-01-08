define([
    'spoon',
    './{{name}}View'
], function (spoon, {{name}}View) {

    'use strict';

    return spoon.Controller.extend({
        $name: '{{name}}Controller',

        /*_defaultState: 'index',
        _states: {
            'index': '_indexState'
        }*/

        _view: null,

        ////////////////////////////////////////////////////////////

        /**
         * Constructor.
         *
         * @param {Element} element The element in which the module will work on
         */
        initialize: function (element) {
            this.$super();

            this._view = this._link(new {{name}}View());
            this._view
                .appendTo(element)
                .render();
        },

        /**
         * Index state handler.
         *
         * @param {Object} state The state parameter bag
         */
        /*_indexState: function (state) {
            // The index state implementation goes here
            // The state might instantiate another module or simply a view
            // See the default ApplicationController implementation for an example
        },*/

        /**
         * {@inheritDoc}
         */
        _onDestroy: function () {
            if (this._view) {
                this._view.destroy();
                this._view = null;
            }

            this.$super();
        }
    });
});

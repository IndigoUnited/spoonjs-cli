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
         */
        initialize: function () {
            this.$super();

            this._view = this._link(new {{name}}View());
            this._view.render();
        },

        /**
         * Some state handler.
         *
         * @param {Object} state The state parameter bag
         */
        /*_someState: function (state) {
            // index state implementation goes here
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
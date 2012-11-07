define([
    'spoon',
    './ApplicationView',
], function (spoon, ApplicationView) {

    'use strict';

    return spoon.Controller.extend({
        $name: 'ApplicationController',

        _defaultState: 'home',
        _states: {
            'home': '_homeState'
        },

        _view: null,

        ////////////////////////////////////////////////////////////

        /**
         * Constructor.
         */
        initialize: function () {
            this.$super();

            // Instantiate and render the application view
            this._view = this._link(new ApplicationView());
            this._view.appendTo(document.body);
            this._view.render();
        },

        /**
         * Home state handler.
         *
         * @param {Object} state The state parameter bag
         */
        _homeState: function (state) {
            // TODO: need to think of something to show to the user
        },


        /**
         * {@inheritDoc}
         */
        _onDestroy: function () {
            this._destroyContent();
            this.$super();
        }
    });
});
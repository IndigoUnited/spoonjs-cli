define([
    'spoon',
    './ApplicationView',
    './HomeView'
], function (spoon, ApplicationView, HomeView) {

    'use strict';

    return spoon.Controller.extend({
        $name: 'ApplicationController',

        _defaultState: 'home',
        _states: {
            'home': '_homeState'
        },

        _current: null,
        _view: null,

        ////////////////////////////////////////////////////////////

        /**
         * Constructor.
         */
        initialize: function () {
            this.$super();

            // Instantiate and render the application view
            this._view = this._link(new ApplicationView());
            this._view
                .appendTo(document.body)
                .render();
        },

        /**
         * Home state handler.
         *
         * @param {Object} state The state parameter bag
         */
        _homeState: function (state) {
            this._destroyCurrent();

            this._current = this._link(new HomeView());
            this._current
                .appendTo('#content')
                .render();
        },

        /**
         * Destroys the current content if any.
         */
        _destroyCurrent: function () {
            if (this._current) {
                this._current.destroy();
                this._current = null;
            }
        },

        /**
         * {@inheritDoc}
         */
        _onDestroy: function () {
            this._destroyCurrent();
            this.$super();
        }
    });
});
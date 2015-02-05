define([
    'spoon/Controller',
    './ApplicationView',
    './HomeView'
], function (Controller, ApplicationView, HomeView) {

    'use strict';

    return Controller.extend({
        $name: 'ApplicationController',

        _defaultState: 'home',
        _states: {
            'home': 'homeState'
        },

        /**
         * Constructor.
         */
        initialize: function () {
            Controller.call(this);

            // Instantiate and render the application view
            this._view = this._link(new ApplicationView());
            this._view.appendTo(document.body);
            this._view.render();

            // Any module that upcasts an error will be handled
            this.on('error', this.handleError, this);
        },

        /**
         * Home state handler.
         *
         * @param {Object} state The state parameter bag
         */
        homeState: function (state) {
            this._destroyContent();

            this._content = this._link(new HomeView());
            this._content.appendTo('#content');
            this._content.render();
        },

        /**
         * Handles an error, possibly coming from the state registry.
         *
         * @param {Error} err The error
         */
        handleError: function (err) {
            // TODO:
            throw err;
        },

        // --------------------------------------

        /**
         * Destroys the current content if any.
         */
        _destroyContent: function () {
            if (this._content) {
                this._content.destroy();
                this._content = null;
            }
        }
    });
});

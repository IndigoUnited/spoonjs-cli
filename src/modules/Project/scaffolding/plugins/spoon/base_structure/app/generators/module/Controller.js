define([
    'spoon',
    './{{name}}View',
    'jquery'
], function (spoon, {{name}}View, $) {

    'use strict';

    return spoon.Controller.extend({
        $name: '{{name}}Controller',

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
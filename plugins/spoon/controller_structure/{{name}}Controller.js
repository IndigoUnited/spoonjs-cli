define([
    'spoon'
], function (spoon) {

    'use strict';

    return spoon.Controller.extend({
        $name: '{{name}}Controller',

        /**
         * Constructor.
         */
        initialize: function () {
            this.$super();

            // Do things here
        },

        /**
         * {@inheritDoc}
         */
        _onDestroy: function () {
            // Destroy things here

            this.$super();
        }
    });
});
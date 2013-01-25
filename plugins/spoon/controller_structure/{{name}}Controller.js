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
        /*_onDestroy: function () {
            // Cancel timers, ajax requests and other stuff here
            // Note that linked child views/controllers are automatically destroyed
            // when this controller is destroyed
            this.$super();
        }*/
    });
});
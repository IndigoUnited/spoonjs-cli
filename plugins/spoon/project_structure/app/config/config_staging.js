define(['app/config/config', 'mout/object/merge'], function (config, merge) {

    'use strict';

    // Configuration file loaded by the framework while in the staging environment
    // Overrides for the staging environment goes here
    // This configuration can be used by any module by simply requiring 'app-config' while in the staging environment

    return merge(config, {
        env: 'staging',
        version: 0,

        // Address overrides
        address: {
            html5: true         // Setup prettier url's by enabling html5
                                // If changed to true, the server needs to be able to rewrite urls to the front controller
        }
    });
});
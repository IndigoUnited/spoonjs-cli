define(['app/config/config', 'amd-utils/object/merge'], function (config, merge) {

    'use strict';

    // Configuration file loaded by the framework while in the dev environment
    // Overrides for the dev environment goes here
    // This configuration can be used by any module by simply requiring 'app/config' while in the dev environment

    return merge(config, {
        env: 'dev'

        // ...
    });
});
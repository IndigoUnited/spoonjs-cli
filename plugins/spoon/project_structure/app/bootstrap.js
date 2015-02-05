requirejs([
    'Application/ApplicationController',
    'services/state',
    '{{baseLibrary}}'
], function (ApplicationController, stateRegistry, {{baseLibraryVar}}) {

    'use strict';

    {{baseLibraryReady}}(function () {
        // Initialize the Application controller
        var appController = new ApplicationController();

        // Glue between the StateRegistry and the AppController
        stateRegistry
        .on('change', appController.delegateState, appController)
        .on('error', appController.handleError, appController)
        .on('unknown', function () {
            // If there's a current state, simply ignore
            // Otherwise transition to the default state
            if (!stateRegistry.getCurrent()) {
                appController.setState();
            }
        });

        stateRegistry.parse();
    });
});

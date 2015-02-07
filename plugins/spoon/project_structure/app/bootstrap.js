requirejs([
    'Application/ApplicationController',
    'services/state',
    '{{baseLibrary}}'
], function (ApplicationController, stateService, {{baseLibraryVar}}) {

    'use strict';

    {{baseLibraryReady}}(function () {
        // Initialize the Application controller
        var appController = new ApplicationController();

        // Glue between the StateRegistry and the AppController
        stateService
        .on('change', appController.delegateState, appController)
        .on('error', appController.handleError, appController)
        .on('unknown', function () {
            // If there's a current state, simply ignore
            // Otherwise transition to the default state
            if (!stateService.getCurrent()) {
                appController.setState();
            }
        });

        stateService.parse();
    });
});

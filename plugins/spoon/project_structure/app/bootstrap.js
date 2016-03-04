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
        .on('error', function (err) {
            // Handle the error
            appController.handleError(err);
            // Navigate to the home if not in any state
            !stateService.getCurrent() && appController.setState();
        })
        .on('unknown', function () {
            // Navigate to the home if not in any state
            !stateService.getCurrent() && appController.setState();
        });

        stateService.parse();
    });
});

requirejs([
    'Application/ApplicationController',
    'services/state',
    '{{baseLibrary}}'
], function (ApplicationController, stateRegistry, {{baseLibraryVar}}) {

    'use strict';

    {{baseLibraryReady}}(function () {
        // Initialize the Application controller
        var appController = new ApplicationController();

        // Listen to the state change event
        stateRegistry.on('change', appController.delegateState, appController);

        // Listen to the unknown state that is fired whenever a URL
        // does not match any state
        stateRegistry.on('unknown', function () {
            // If there's a current state, simply ignore
            // Otherwise transition to the default state
            if (!stateRegistry.getCurrent()) {
                appController.setState();
            }
        });

        stateRegistry.parse();
    });
});

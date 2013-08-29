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

        // Call parse() to make the state registry read the address value
        stateRegistry.parse();
    });
});

/*global requirejs*/

// This is the bootstrap file
// It contains the loader configuration as well as the application bootstrap

// Loader configuration
requirejs.config({
    baseUrl: './root/src',
    paths: {
        // Vendors
        'amd-utils': '../vendor/amd-utils/src',
        'events-emitter': '../vendor/events-emitter/src',
        'dom-responder': '../vendor/dom-responder/src',
        'base-adapter': '../vendor/base-adapter/src/adapters/jquery',
        'base-adapter/src': '../vendor/base-adapter/src',
        'address': '../vendor/address/src',
        'jquery': '../vendor/jquery/jquery',
        'doT': '../vendor/doT/doT',
        'text': '../vendor/requirejs-text/text',
        'has': '../vendor/has/has',
        'bootstrap': '../vendor/bootstrap/js/bootstrap',

        // App & config
        'app': '../app',
        'app-config': '../app/config/config_dev',

        // Services
        'services/broadcaster': '../vendor/spoon.js/src/core/Broadcaster/BroadcasterFactory',
        'services/address': '../vendor/spoon.js/src/core/Address/AddressFactory',
        'services/state': '../vendor/spoon.js/src/core/StateRegistry/StateRegistryFactory'
    },
    shim: {
        'bootstrap' : {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    packages: [
        // css plugin
        {
            name: 'css',
            location: '../vendor/curl-css',
            main: 'index'
        },
        // spoon
        {
            name: 'spoon',
            location: '../vendor/spoon.js/src'
        },
        // dejavu
        {
            name: 'dejavu',
            location: '../vendor/dejavu/dist/amd/strict'
        }
    ],
    urlArgs: 'bust=' + (+new Date())    // Fix cache issues
});

// Application bootstrap
require([
    'Application/ApplicationController',
    'services/state',
    'jquery'
], function (ApplicationController, stateRegistry, $) {

    'use strict';

    $(document).ready(function () {
        // Initialize the Application controller
        var appController = new ApplicationController();

        // Listen for the state change event and call setState on the Application controller
        stateRegistry.on('change', appController.setState, appController);

        // Call set state on the Application controller with the current registry state
        // At this time, the current state on the state registry is already set
        // This will effectively bootstrap the application
        appController.setState(stateRegistry.getCurrent());
    });
});
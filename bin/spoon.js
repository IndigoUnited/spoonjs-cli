#!/usr/bin/env node

var Engine = require('../src/Engine'),
    updateNotifier = require('update-notifier'),
    notifier,
    spooncli;

// Checks for available update
var notifier = updateNotifier({
    packagePath: __dirname + '/../package'
});
if (notifier.update) {
    notifier.notify();
}

// Initialize the engine
spooncli = new Engine(process.argv);
spooncli.parse();
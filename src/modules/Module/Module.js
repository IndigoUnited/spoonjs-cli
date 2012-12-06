var d          = require('dejavu'),
    path       = require('path'),
    automaton  = require('automaton'),
    BaseModule = require('../../BaseModule'),
    findModule = require('../../util/find-module')
;

var Module = d.Class.declare({
    $name: 'Module',
    $extends: BaseModule,

    create: function (options, name) {
        // ensure this is a spoon project
        if (!this._isSpoonProject()) {
            this._printError('Current working directory seems not to be a spoon project', 1);
        }

        var cwd = path.normalize(process.cwd()),
            autofile,
            location,
            locations,
            target;

        // Find the module according to the location
        locations = findModule(options.location);
        if (!locations.length) {
            this._printError('Unknown location', 1);
        }
        if (locations.length > 1) {
            this._printError('Location is ambigous: ' + locations.join(', '), 1);
        }

        location = path.normalize(locations[0]);

        // location path must belong to the cwd
        if (location.indexOf(cwd) !== 0) {
            this._printError('Module location does not belong to the current working directory', 1);
        }

        // check if module already exists
        target = path.join(location, name);
        if (this._fileExists(target)) {
            this._printError(target + ' already exists', 1);
        }

        // create the module
        // use the generator autofile or the local one if not available
        autofile = path.join(process.cwd(), '/tasks/generators/module.autofile.js');
        if (!this._fileExists(autofile)) {
            autofile = './autofile';
        }

        console.log(('Creating module: ' + name).info);
        autofile = require(autofile);
        automaton.run(autofile, { name: name, location: location });
    },

    test: function (options, name) {
        console.log('testing module: ' + name);
    },

    getCommands: function () {
        return {
            'create <name>': {
                description: 'Create a new module',
                options: [
                    ['-l, --location', 'Where the module will be created. Defaults to the Application module.', process.cwd() + '/src/Application']
                ]
            }/*,
            'test <name>': {
                description: 'Run the unit tests of the specified module'
            }*/
        };
    }
});

module.exports = Module;

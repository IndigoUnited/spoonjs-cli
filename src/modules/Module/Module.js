var d          = require('dejavu'),
    automaton  = require('automaton'),
    BaseModule = require('../../BaseModule')
;

var Module = d.Class.declare({
    $name: 'Module',
    $extends: BaseModule,

    create: function (options, name) {
        // create the module
        var autofile = require('./autofile');

        // for each of the plugins that the user requested, run its autofile
        automaton.run(autofile, { name: name, location: options.location });
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

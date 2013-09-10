'use strict';

var d          = require('dejavu'),
    automaton  = require('automaton').create(),
    BaseModule = require('../BaseModule')
;

var Module = d.Class.declare({
    $name: 'Module',
    $extends: BaseModule,

    create: function (name, options) {
        this._assertProject();

        // create spoon base module by running the autofile
        // use the generator autofile or the local one if not available
        var autofile = process.cwd() + '/tasks/generators/module_create.js';
        if (!this._fileExists(autofile)) {
            autofile = '../../plugins/spoon/module_create';
        }

        autofile = require(autofile);
        options.name = name;

        automaton
            .run(autofile, options, function (err) {
                process.exit(err ? 1 : 0);
            })
            .pipe(process.stdout);
    },

    // --------------------------------------------------
    // --------------------------------------------------

    getCommands: function () {
        return {
            'create <name>': {
                description: 'Create a new module',
                options: [
                    ['-f, --force', 'Force the creation of the module, even if the module already exists.', null, Boolean]
                ]
            }
        };
    }
});

module.exports = Module;

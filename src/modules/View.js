'use strict';

var d          = require('dejavu'),
    automaton  = require('automaton').create(),
    BaseModule = require('../BaseModule')
;

var View = d.Class.declare({
    $name: 'View',
    $extends: BaseModule,

    create: function (name, options) {
        this._assertProject();

        // create spoon view by running the autofile
        // use the generator autofile or the local one if not available
        var autofile = process.cwd() + '/tasks/generators/view_create.autofile.js';
        if (!this._fileExists(autofile)) {
            autofile = '../../plugins/spoon/view-create.autofile';
        }

        autofile = require(autofile);
        options.name = name;

        automaton
            .run(autofile, options, function (err) {
                process.exit(err ? 1 : 0);
            })
            .pipe(process.stdout);
    },

    getCommands: function () {
        return {
            'create <name>': {
                description: 'Create a new view',
                options: [
                    ['-f, --force', 'Force the creation of the view, even if the view already exists.', false, this._parseBoolean]
                ]
            }
        };
    }
});

module.exports = View;

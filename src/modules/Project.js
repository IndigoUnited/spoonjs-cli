'use strict';

var d          = require('dejavu'),
    automaton  = require('automaton').create(),
    BaseModule = require('../BaseModule')
;

var Project = d.Class.declare({
    $name: 'Project',
    $extends: BaseModule,

    _tmplComponent: __dirname + '/templates/component.json.tmpl',
    _tmplPackage:   __dirname + '/templates/package.json.tmpl',

    create: function (name, options) {
        // create spoon project by running the autofile
        var spoon_scaffolding = require('../../plugins/spoon/project_create.autofile');
        options.name = name;

        automaton
            .run(spoon_scaffolding, options, function (err) {
                process.exit(err ? 1 : 0);
            })
            .pipe(process.stdout);
    },

    // --------------------------------------------------

    run: function (options) {
        this._assertProject();

        // TODO: use the project install and fallback to the cli one
        // run the server task
        var server = require(process.cwd() + '/tasks/server.js');
        automaton.run(server, options, function (err) {
            process.exit(err ? 1 : 0);
        })
        .pipe(process.stdout);
    },

    // --------------------------------------------------

    install: function (options) {
        this._assertProject();

        // TODO: use the project install and fallback to this one
        // create spoon project by running the autofile
        var spoon_install = require('../../plugins/spoon/project_install.autofile');

        automaton
            .run(spoon_install, options, function (err) {
                process.exit(err ? 1 : 0);
            })
            .pipe(process.stdout);
    },

    // --------------------------------------------------

    test: function (options) {

    },

    // --------------------------------------------------

    deploy: function (options) {

    },

    // --------------------------------------------------
    // --------------------------------------------------

    getCommands: function () {
        return {
            'create <name>': {
                description: 'Create a new project',
                options: [
                    ['-f, --force', 'Force the creation of the project, even if a spoon project is already created', false, this._parseBoolean]
                ]
            },
            'run': {
                description: 'Run the project',
                options: [
                    ['-e, --env', 'The environment to run. Defaults to dev.', 'dev'],
                    ['-p, --port', 'The server port. Defaults to 8000.', 8000],
                    ['-h, --host', 'The server host. Defaults to 127.0.0.1', '127.0.0.1']
                ]
            },
            'install': {
                description: 'Installs the project dependencies'
            }
            /*'test': {
                description: 'Run the unit tests of the whole project'
            },
            'deploy': {
                description: 'Deploy the project'
            }*/
        };
    }
});

module.exports = Project;

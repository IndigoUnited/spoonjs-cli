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
        var autofile = require('../../plugins/spoon/project_create');
        options.name = name;

        automaton
            .run(autofile, options, function (err) {
                process.exit(err ? 1 : 0);
            })
            .pipe(process.stdout);
    },

    // --------------------------------------------------

    run: function (options) {
        this._assertProject();

        // TODO: use the project run and fallback to the cli one
        // run the server task
        var autofile = require(process.cwd() + '/tasks/server.js');
        automaton.run(autofile, options, function (err) {
            process.exit(err ? 1 : 0);
        })
        .pipe(process.stdout);
    },

    // --------------------------------------------------

    install: function (options) {
        this._assertProject();

        // TODO: use the project install and fallback to the cli one
        //       this should only be done when we decide on the automaton community tasks
        // install spoon project by running the autofile
        var autofile = require(process.cwd() + '/tasks/install.js');
        automaton
            .run(autofile, options, function (err) {
                process.exit(err ? 1 : 0);
            })
            .pipe(process.stdout);
    },

    // --------------------------------------------------

    build: function (options) {
        this._assertProject();

        // TODO: use the project build and fallback to the cli one
        //       this should only be done when we decide on the automaton community tasks
        // build spoon project by running the autofile
        var autofile = require(process.cwd() + '/tasks/build.js');
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
                description: 'Create a new project',
                options: [
                    ['-f, --force', 'Force the creation of the project, even if a spoon project is already created', false, Boolean]
                ]
            },
            'run': {
                description: 'Run the project',
                options: [
                    ['-e, --env', 'The environment to run. Defaults to dev.', 'dev', String],
                    ['-p, --port', 'The server port. Defaults to 8000.', 8000, Number],
                    ['-h, --host', 'The server host. Defaults to 127.0.0.1', '127.0.0.1', String]
                ]
            },
            'install': {
                description: 'Installs the project dependencies',
                options: [
                    ['-f, --force', 'Force fetching of remote sources. Defaults to false.', false, Boolean]
                ]
            },
            'build': {
                description: 'Build the project',
                options: [
                    ['-e, --env', 'The environment to build. Defaults to prod.', 'prod', String]
                ]
            }
        };
    }
});

module.exports = Project;

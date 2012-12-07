var d          = require('dejavu'),
    path       = require('path'),
    fs         = require('fs'),
    BaseModule = require('../../BaseModule'),
    automaton  = require('automaton')
;

var Project = d.Class.declare({
    $name: 'Project',
    $extends: BaseModule,

    _tmplComponent: __dirname + '/templates/component.json.tmpl',
    _tmplPackage:   __dirname + '/templates/package.json.tmpl',

    create: function (options, name) {
        console.log(('Creating project: ' + name).info);
        // TODO: add some basic questions and modify project accordingly:
        //       - What base library to use
        //       - What template system to use
        //       - What css pre-processor to use
        var location = path.normalize(process.cwd()),
            files,
            spoon_scaffolding;

        try {
            files = fs.readdirSync(location);
        } catch (e) {
            this._printError(location + ' is not a valid directory');
        }

        // If directory is empty, create project there
        // Otherwise the folder is the project name
        if (files.length) {
            location = path.join(location, name);
        }

        if (!options.force && this._isSpoonProject(location)) {
            this._printError(location + ' seems to be already a spoon project', 1);
        }

        // create spoon.js base project
        spoon_scaffolding = require('./scaffolding/spoon/autofile');
        automaton.run(spoon_scaffolding, { dir: location });
    },

    // --------------------------------------------------

    run: function (options) {
        if (!this._isSpoonProject()) {
            this._printError('Current working directory seems not to be a spoon project', 1);
        }

        var server = require(path.join(process.cwd(), 'tasks/server.js'));
        automaton.run(server, options);
    },

    // --------------------------------------------------

    test: function (options) {
        console.log('Not implemented yet'.warning);
    },

    // --------------------------------------------------

    deploy: function (options) {
        console.log('Not implemented yet'.warning);
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

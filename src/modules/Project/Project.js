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

        var location,
            files,
            spoon_scaffolding;

        location = path.normalize(location || process.cwd());
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

        if (this._isSpoonProject(location)) {
            this._printError(location + ' seems to be already a spoon project', 1);
        }

        // create spoon.js base project
        spoon_scaffolding = require('./scaffolding/spoon/autofile');
        automaton.run(spoon_scaffolding, { dir: location });
    },

    // --------------------------------------------------

    test: function (options) {
        console.log('Not implemented yet'.warning);
    },

    // --------------------------------------------------

    run: function (options) {
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
//                    ['-b, --boilerplate', 'If the HTML 5 boilerplate should be bundled with the project. Included by default.', true, this._parseBoolean],
//                    ['--bootstrap', 'If the Twitter Bootstrap should be bundled with the project', false, this._parseBoolean]
                ]
            },
            'run': {
                description: 'Run the project'
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

var d          = require('dejavu'),
    BaseModule = require('../../BaseModule'),
    automaton  = require('automaton')
;

var Project = d.Class.declare({
    $name: 'Project',
    $extends: BaseModule,

    _tmplComponent: __dirname + '/templates/component.json.tmpl',
    _tmplPackage:   __dirname + '/templates/package.json.tmpl',

    create: function (options, name, $location) {
        console.log(('Creating project: ' + name).info);
        $location = $location || process.cwd() + '/' + name;

        // create spoon.js base project
        var spoon_scaffolding = require('./scaffolding/spoon/autofile');

        // for each of the plugins that the user requested, run its autofile
        automaton.run(spoon_scaffolding, { dir: $location });

        // finish up the scaffolding
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
                    ['-l, --location', 'Where the project will be created. Defaults to the current working directory', process.cwd()]
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

var d          = require('dejavu'),
    BaseModule = require('../BaseModule')
;

var Project = d.Class.declare({
    $name: 'Project',
    $extends: BaseModule,

    create: function (name, something) {
        console.log('creating project: ' + name + something);
    },

    test: function () {

    },

    run: function () {

    },

    deploy: function () {

    },

    getCommands: function () {
        return {
            'create <name> <something>': {
                description: "Create a new project",
                options: [
                    ['-l, --location', 'Where the project will be created. Defaults to the current working directory', process.cwd()]
                ]
            },
            'test': {
                description: "Run the unit tests of the whole project"
            },
            'run': {
                description: "Run the project"
            },
            'deploy': {
                description: "Deploy the project"
            },
        };
    }
});

module.exports = Project;

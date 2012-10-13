var d          = require('dejavu'),
    BaseModule = require('../../BaseModule'),
    dot        = require('dot')
;

var Project = d.Class.declare({
    $name: 'Project',
    $extends: BaseModule,

    create: function (name) {
        console.log(('creating project: ' + name).info);
    },

    _setUpComponents: function () {
        
    }

    // --------------------------------------------------

    test: function () {

    },

    // --------------------------------------------------

    run: function () {

    },

    // --------------------------------------------------

    deploy: function () {

    },

    // --------------------------------------------------
    // --------------------------------------------------

    getCommands: function () {
        return {
            'create <name>': {
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

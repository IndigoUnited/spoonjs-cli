var d          = require('dejavu'),
    BaseModule = require('../../BaseModule'),
    doT        = require('dot'),
    mkdirp     = require('mkdirp'),
    fs         = require('fs')
;

var Project = d.Class.declare({
    $name: 'Project',
    $extends: BaseModule,

    _tmplComponents: __dirname + '/templates/components.json.tmpl',

    create: function (name, $location) {
        console.log(('creating project: ' + name).info);
        $location = $location || process.cwd() + '/' + name;

        // TODO: check if destination folder already exists, and has contents

        // create project folder
        mkdirp.sync($location);

        // set up components.json
        this._setUpComponents($location, { 'name': name});

        // install components with Bower

        // set up package.json

        // install server-side dependencies with npm
    },

    _setUpComponents: function (location, args) {
        var contents = this._renderTemplate(this._tmplComponents, args);

        fs.writeFileSync(location + '/components.json', contents);
    },

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

var d          = require('dejavu'),
    BaseModule = require('../../BaseModule'),
    doT        = require('dot'),
    mkdirp     = require('mkdirp'),
    fs         = require('fs'),
    async      = require('async'),
    exec       = require('child_process').exec
;

var Project = d.Class.declare({
    $name: 'Project',
    $extends: BaseModule,

    _tmplComponent: __dirname + '/templates/component.json.tmpl',
    _tmplPackage:   __dirname + '/templates/package.json.tmpl',

    create: function (name, $location) {
        console.log(('Creating project: ' + name).info);
        $location = $location || process.cwd() + '/' + name;

        // TODO: check if destination folder already exists, and has contents

        var that = this;

        async.series([
            // set up project folder
            function(callback) {
                console.log('  setting up project folder'.grey);

                mkdirp.sync($location);

                callback();
            },
            // set up components.json and install components with Bower
            function(callback) {
                console.log('  setting up project dependencies... (can take a few seconds)'.grey);

                that.setUpComponents($location, { 'name': name});

                that.installComponents($location, callback);
            },
            // set up package.json and install server-side dependencies with npm
            function(callback) {
                that.setUpPackage($location, { 'name': name});

                that.installPackage($location, callback);
            },
            // scaffold the project
            function (callback) {
                console.log('  scaffolding the project...'.grey);
                callback();
            },
            // project ready
            function (callback) {
                console.log('Project ready!'.info);

                callback();
            }
        ]);

    },

    createBaseFolders: function (location) {
        mkdirp.sync(location + '/app');
        mkdirp.sync(location + '/src/Application/assets');
        mkdirp.sync(location + '/web');
    },

    setUpComponents: function (location, args) {
        var contents = this._renderTemplate(this._tmplComponent, args);

        fs.writeFileSync(location + '/component.json', contents);
    },

    installComponents: function (location, callback) {
        exec('bower install', { cwd: location }, function (error, stdout, stderr) {
            // TODO: this error check doesn't work, because there is no error or stderr
            // present when some error happens, only stdout. Need to rework this
            if (error !== null) {
                console.log(('Error running bower install: ' + stdout).error);
                process.exit();
            }

            callback();
        });
    },

    setUpPackage: function (location, args) {
        var contents = this._renderTemplate(this._tmplPackage, args);

        fs.writeFileSync(location + '/package.json', contents);
    },

    installPackage: function (location, callback) {
        exec('npm install', { cwd: location }, function (error, stdout, stderr) {
            if (error !== null) {
                console.log(('Error running npm install: ' + stderr).error);
                process.exit();
            }

            callback();
        });
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
                    ['-l, --location', 'Where the project will be created. Defaults to the current working directory', process.cwd()],
                    ['-b, --with-h5b <include>', 'If the HTML 5 boilerplate should be bundled with the project. Included by default.', true],
                    ['-t, --with-bootstrap <include>', 'If the Twitter Bootstrap should be bundled with the project', false]
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

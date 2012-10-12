var d       = require('dejavu'),
    fs      = require('fs'),
    colors  = require('colors') // https://github.com/Marak/colors.js
    utils   = require('amd-utils')
;

// set up a useful set of formats
colors.setTheme({
    input: 'grey',
    info:  'green',
    data:  'grey',
    help:  'cyan',
    warn:  'yellow',
    debug: 'blue',
    error: 'red',


});

var Engine = d.Class.declare({
    $name: 'Engine',

    $constants: {
        COMMAND_USAGE_WIDTH: 30
    },

    _version:    '0.0.1',
    _modulesDir: __dirname + '/modules/',
    _modules:    [],
    _argv:       null,

    initialize: function (argv) {
        this._loadModules();

        this._argv = argv;
    },

    parse: function () {
        var module,
            command
        ;

        // if user didn't specify enough args, show usage
        if (this._argv.length < 4) {
            this.showUsage();

            process.exit();
        }

        module  = this._argv[2];
        command = this._argv[3];

        // try to run the command that the user specified
        if (this._existsHandler(module, command)) {
            this.run(module, command);
        }
        else {
            console.error('\nInvalid command'.error);

            this.showUsage();
        }

        return this;
    },

    run: function (module, command) {
        var fn = this._modules[module][command];
        this._modules[module][command].apply(this._modules[module], this._argv.slice(4));

        return this;
    },

    showUsage: function () {
        var script = this._argv[1].split(/\//),
            moduleName,
            output;

        script = script[script.length - 1];

        output = [
            '\nUsage: ' + (script + ' <module> <command> [options]\n').cyan
        ];

        for (moduleName in this._modules) {
            var commands = this._modules[moduleName].getCommands();
            output.push(moduleName.green);

            for (var command in commands) {
                var description = commands[command].description;
                output.push(this._pad("  " + command, this.$self.COMMAND_USAGE_WIDTH).grey + description);
            }

            output.push('');
        }

        this._output(output);

        return this;
    },

    _loadModules: function () {
        var filenames = fs.readdirSync(this._modulesDir),
            moduleName,
            i
        ;
        // foreach file in the modules folder, load it, and initialize it
        for (i in filenames) {
            moduleName = filenames[i].split('.',1)[0];

            // load the module
            this._loadModule(moduleName, this._modulesDir + moduleName);
        }
    },

    _loadModule: function (name, file) {
        var module = require(file);

        this._modules[name.toLowerCase()] = new module(this);
    },

    _existsHandler: function (module, command) {
        if (utils.lang.isFunction(this._modules[module][command])) {
            return true;
        }

        return false;
    },

    _pad: function (str, width) {
        var len = Math.max(0, width - str.length);

        return str + Array(len + 1).join(' ');
    },

    _output: function (outputArr) {
        for (var i in outputArr) {
            console.log(outputArr[i]);
        }
    }

});

module.exports = Engine;
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

    _version:        '0.0.1',
    _modulesDir:     __dirname + '/modules/',
    _modules:        [],
    _moduleCommands: [],
    _argv:           null,

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
            this.exitWithUsage();
        }

        // run the command
        this.run(this._argv[2], this._argv[3]);

        return this;
    },

    run: function (module, command) {
        // if command doesn't exist, show usage
        if (!this._existsHandler(module, command)) {
            this.exitWithUsage('Invalid command');
        }

        // check if all the required arguments were provided
        var cmdArgCount      = this._moduleCommands[module][command].argCount,
            providedArgCount = this._argv.length - 4
        ;
        if (cmdArgCount != providedArgCount) {
            this.exitWithUsage('Invalid argument count');
        }

        // run the command
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
                output.push(this._pad("  " + command, this.$self.COMMAND_USAGE_WIDTH).grey + " " + description);
            }

            output.push('');
        }

        this._output(output);

        return this;
    },

    exitWithUsage: function (err) {
        if (utils.lang.isString(err)) {
            console.error('\n' + err.error);
        }

        this.showUsage();
        process.exit();
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
            this._loadModule(moduleName.toLowerCase(), this._modulesDir + moduleName + '/' + moduleName);
        }
    },

    _loadModule: function (name, file) {
        var module = require(file),
            modInstance,
            command,
            cmdName,
            cmdArgs;

        this._modules[name.toLowerCase()] = modInstance = new module(this);

        this._moduleCommands[name] = {};

        // for each of the commands
        for (command in modInstance.getCommands()) {
            // check how many arguments are required
            cmdName = command.split(/\s+/)[0];
            cmdArgs = command.match(/<[^>]+>/g);

            // save information for later validation
            this._moduleCommands[name][cmdName] = {
                argCount: utils.lang.isArray(cmdArgs) ? cmdArgs.length : 0
            }
        }
    },

    _existsHandler: function (module, command) {
console.log(this._modules[module], module, command);
        if (!utils.lang.isUndefined(this._modules[module]) && utils.lang.isFunction(this._modules[module][command])) {
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
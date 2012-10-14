var d       = require('dejavu'),
    fs      = require('fs'),
    colors  = require('colors') // https://github.com/Marak/colors.js
    utils   = require('amd-utils'),
    os      = require('os'),
    inspect = require('util').inspect
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
            this.exitWithUsage('Unrecognized command');
        }

        // check if all the required arguments were provided
        // TODO: show usage for the specific command that the user executed
        var cmdArgCount      = this._moduleCommands[module][command].argCount,
            providedArgCount = this._argv.length - 4
        ;
        if (cmdArgCount != providedArgCount) {
            this.exitWithCmdUsage('Missing required arguments', module, command);
        }

        // run the command
        this._modules[module][command].apply(this._modules[module], this._argv.slice(4));

        return this;
    },

    showUsage: function () {
        var moduleName,
            output;

        output = [
            '\nUsage: ' + (this._getScriptName() + ' <module> <command> [options]\n').cyan
        ];

        for (moduleName in this._modules) {
            var commands = this._modules[moduleName].getCommands();
            output.push(moduleName.green);

            for (var command in commands) {
                var description = commands[command].description;
                output.push(utils.string.rpad("  " + command, this.$self.COMMAND_USAGE_WIDTH).grey + " " + description);
            }

            output.push('');
        }

        this._output(output);

        return this;
    },

    showCommandUsage: function (module, command) {
        var output;

        output = [
            '\nUsage: ' + (this._getScriptName() + ' ' + module + ' ' + this._moduleCommands[module][command].definition + '\n').cyan
        ];

        this._output(output);
        process.exit();
    },

    exitWithUsage: function (err) {
        if (utils.lang.isString(err)) {
            console.error('\n' + err.error);
        }

        this.showUsage();
        process.exit();
    },

    exitWithCmdUsage: function (err, module, command) {
        if (utils.lang.isString(err)) {
            console.error('\n' + err.error);
        }

        this.showCommandUsage(module, command);
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

//        console.log(inspect(this._moduleCommands, false, null));
    },

    _loadModule: function (name, file) {
        var module = require(file),
            modInstance,
            commands,
            command,
            cmdName,
            cmdArgs,
            options,
            option;

        this._modules[name.toLowerCase()] = modInstance = new module(this);

        this._moduleCommands[name] = {};

        // for each of the commands
        commands = modInstance.getCommands();
        for (command in commands) {
            // check how many arguments are required
            cmdName = command.split(/\s+/)[0];
            cmdArgs = command.match(/<[^>]+>/g);

            // save information for later validation
            this._moduleCommands[name][cmdName] = {
                'definition'      : command,
                'argCount'        : utils.lang.isArray(cmdArgs) ? cmdArgs.length : 0,
                'options'         : {},
                'optionShortcuts' : {}
            }

            // store option list
            options = commands[command].options;
            for (option in options) {
                var opt            = options[option],
                    optionName     = opt[0].split(/--/)[1],
                    optionShortcut = opt[0].split(/,/).length > 1 ? opt[0][1] : null;

                // save the option definition
                this._moduleCommands[name][cmdName].options[optionName] = {
                    description : opt[1],
                    deflt       : opt[2], // default value
                    cast        : opt[3]  // casting function
                }

                // if option has a shortcut, store it
                if (!utils.lang.isNull(optionShortcut)) {
                    this._moduleCommands[name][cmdName].optionShortcuts[optionShortcut] = optionName;                
                }
            }
        }
    },

    _existsHandler: function (module, command) {
        if (!utils.lang.isUndefined(this._modules[module]) && utils.lang.isFunction(this._modules[module][command])) {
            return true;
        }

        return false;
    },

    _output: function (outputArr) {
        for (var i in outputArr) {
            console.log(outputArr[i]);
        }
    },

    _getScriptName: function () {
        var script = this._argv[1].split(os.platform().match(/win32/) ? (/\\/) : (/\//));
        return script[script.length - 1];
    }
});

module.exports = Engine;
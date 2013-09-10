'use strict';

var d       = require('dejavu'),
    fs      = require('fs'),
    colors  = require('colors'), // https://github.com/Marak/colors.js
    utils   = require('mout'),
    os      = require('os'),
    nopt    = require('nopt')
;

// set up a useful set of formats
colors.setTheme({
    input: 'grey',
    info:  'green',
    data:  'grey',
    help:  'cyan',
    warn:  'yellow',
    debug: 'blue',
    error: 'red'
});

var Engine = d.Class.declare({
    $name: 'Engine',

    $constants: {
        FIRST_COLUMN_WIDTH: 30
    },

    _version:        '0.0.7',
    _modulesDir:     __dirname + '/modules/',
    _modules:        [],
    _moduleCommands: [],
    _argv:           null,
    _request:        {},

    initialize: function (argv) {
        this._loadModules();

        this._argv = argv;
    },

    parse: function () {
        var module,
            command,
            parsedOpts;

        // build the request
        this._request.module  = module  = this._argv[2];
        this._request.command = command = this._argv[3];

        // if user didn't specify enough args, show usage
        if (!module || !command) {
            this.exitWithUsage();
        }

        // make sure that the command is valid
        this._assertHandlerExists(module, command);

        // parse opts with nopt
        parsedOpts = nopt(this._moduleCommands[module][command].optionsTypes, this._moduleCommands[module][command].optionsShortcuts);

        // parse args
        this._request.args = parsedOpts.argv.remain.slice(2);

        // run the command
        this.run(this._request.module, this._request.command, this._request.args, parsedOpts);

        return this;
    },

    run: function (module, command, args, options) {
        this._assertHandlerExists(module, command);

        // check if all the required arguments were provided
        var cmdArgCount      = this._moduleCommands[module][command].argCount,
            providedArgCount = args.length,
            opt,
            optName
        ;

        if (cmdArgCount !== providedArgCount) {
            this.exitWithCmdUsage('Wrong arguments count', module, command);
        }

        // fill in the options
        opt = {};
        for (optName in this._moduleCommands[module][command].options) {
            opt[optName] = options[optName] !== undefined ? options[optName] : this._moduleCommands[module][command].options[optName].deflt;
            if (opt[optName] == null) {
                delete opt[optName];
            }
        }

        // run the command
        args.push(opt);
        this._modules[module][command].apply(this._modules[module], args);

        return this;
    },

    showUsage: function () {
        var moduleName,
            output,
            commands,
            command,
            description;

        output = [
            '\nUsage: ' + (this._getScriptName() + ' <module> <command> [options]\n').cyan
        ];

        for (moduleName in this._modules) {
            commands = this._modules[moduleName].getCommands();

            // Skip if the module has no commands
            if (!utils.object.size(commands)) {
                continue;
            }

            output.push(moduleName.green);

            for (command in commands) {
                description = commands[command].description;
                output.push(utils.string.rpad('  ' + command, this.$self.FIRST_COLUMN_WIDTH).grey + ' ' + description);
            }

            output.push('');
        }

        this._output(output);

        return this;
    },

    showCommandUsage: function (module, command) {
        var output,
            optName,
            opts = this._moduleCommands[module][command].options;

        output = [
            '\n' + this._moduleCommands[module][command].description.info + '\n',
            'Usage: ' + (this._getScriptName() + ' ' + module + ' ' + this._moduleCommands[module][command].definition + (utils.object.size(opts) ? ' [options]' : '') + '\n').cyan
        ];

        for (optName in opts) {
            output.push(utils.string.rpad('  ' + opts[optName].definition, this.$self.FIRST_COLUMN_WIDTH).grey + ' ' + opts[optName].description);
        }

        output.push('');

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
        if (!this._moduleCommands[module][command]) {
            this.exitWithUsage('Invalid command provided');
        }

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
            moduleName = filenames[i].split('.', 1)[0];

            if (!moduleName) {
                continue;
            }

            // load the module
            this._loadModule(moduleName.toLowerCase(), this._modulesDir + moduleName);
        }
    },

    _loadModule: function (name, file) {
        var Module = require(file),
            modInstance,
            commands,
            command,
            cmdName,
            cmdArgs,
            options,
            option,
            opt,
            optionName,
            optionShortcut;

        this._modules[name.toLowerCase()] = modInstance = new Module(this);

        this._moduleCommands[name] = {};

        // for each of the commands
        commands = modInstance.getCommands();
        for (command in commands) {
            // check how many arguments are required
            cmdName = command.split(/\s+/)[0];
            cmdArgs = command.match(/<[^>]+>/g);

            // save information for later validation
            this._moduleCommands[name][cmdName] = {
                definition       : command,
                description      : commands[command].description,
                argCount         : utils.lang.isArray(cmdArgs) ? cmdArgs.length : 0,
                options          : {},
                optionsTypes     : {},
                optionsShortcuts : {}
            };

            // store option list
            options = commands[command].options;
            for (option in options) {
                opt            = options[option];
                optionName     = opt[0].split(/--/)[1];
                optionShortcut = opt[0].split(/,/).length > 1 ? opt[0][1] : null;

                // save the option definition
                this._moduleCommands[name][cmdName].options[optionName] = {
                    definition  : opt[0],
                    description : opt[1],
                    deflt       : opt[2] // default value
                };

                // save the option types
                if (opt[3]) {
                    this._moduleCommands[name][cmdName].optionsTypes[optionName] = opt[3];
                }

                // if option has a shortcut, store it
                if (!utils.lang.isNull(optionShortcut)) {
                    this._moduleCommands[name][cmdName].optionsShortcuts[optionShortcut] = ['--' + optionName];
                }
            }
        }
    },

    _existsHandler: function (module, command) {
        if (this._modules[module] && utils.lang.isFunction(this._modules[module][command])) {
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
    },

    _assertHandlerExists: function (module, command) {
        if (!this._existsHandler(module, command)) {
            this.exitWithUsage('Invalid command');
        }
    }
});

module.exports = Engine;

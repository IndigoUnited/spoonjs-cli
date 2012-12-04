var d       = require('dejavu'),
    fs      = require('fs'),
    colors  = require('colors'), // https://github.com/Marak/colors.js
    utils   = require('amd-utils'),
    os      = require('os')
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

    _version:        '0.0.1',
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
            argvLen = this._argv.length,
            castFn,
            eqPos,
            i,
            arg,
            optK,
            optV
        ;

        this._request.args    = [];
        this._request.options = {};

        // build the request
        this._request.module  = module  = this._argv[2];
        this._request.command = command = this._argv[3];

        // divide each of the remaining arguments into args and options
        for (i = 4; i < argvLen; ++i) {
            if (utils.lang.isUndefined(this._argv[i])) {
                break;
            }

            arg = this._argv[i];

            // if user requested help, show command usage
            if (arg === '--help' || arg === '-h') {
                this.exitWithCmdUsage(null, module, command);
            }

            // if arg is a shortcut for an option, translate into its respective option
            if (/^-[^\-]/.exec(arg)) {
                this._assertOptionShortcutExists(module, command, arg[1]);
                arg = '--' + this._moduleCommands[module][command].optionShortcuts[arg];
            }

            // if arg is an option
            if (/--/.exec(arg)) {
                eqPos = arg.indexOf('=');

                // if the value was specified, get it and run the casting function, if one is set
                if (eqPos > 0) {
                    optK = arg.slice(2, eqPos);
                    this._assertOptionExists(module, command, optK);
                    optV = arg.slice(eqPos + 1);
                    castFn = this._moduleCommands[module][command].options[optK].cast;
                    if (utils.lang.isFunction(castFn)) {
                        optV = castFn(optV);
                    }
                }
                // only the option was passed, use its default value
                else {
                    optK = arg.slice(2);
                    this._assertOptionExists(module, command, optK);
                    optV = this._moduleCommands[module][command].options[optK].deflt;
                }

                // save the option
                this._request.options[optK] = optV;
            }
            // arg is not an option, add it to the arguments list
            else {
                this._request.args.push(arg);
            }
        }

        // if user didn't specify enough args, show usage
        if (!module || !command) {
            this.exitWithUsage();
        }

        // make sure that the command is valid
        this._assertHandlerExists(module, command);

        // run the command
        this.run(this._request.module, this._request.command, this._request.args, this._request.options);

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
        // TODO: do not take into account options (--something or -s)
        if (cmdArgCount !== providedArgCount) {
            this.exitWithCmdUsage('Wrong arguments count', module, command);
        }

        // fill in the options
        opt = {};
        for (optName in this._moduleCommands[module][command].options) {
            opt[optName] = !utils.lang.isUndefined(options[optName]) ? options[optName] : this._moduleCommands[module][command].options[optName].deflt;
        }

        // run the command
        this._modules[module][command].apply(this._modules[module], [opt].concat(args));

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
            'Usage: ' + (this._getScriptName() + ' ' + module + ' ' + this._moduleCommands[module][command].definition + '\n').cyan
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
        if (utils.lang.isUndefined(this._moduleCommands[module][command])) {
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
            this._loadModule(moduleName.toLowerCase(), this._modulesDir + moduleName + '/' + moduleName);
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
                'definition'      : command,
                'description'     : commands[command].description,
                'argCount'        : utils.lang.isArray(cmdArgs) ? cmdArgs.length : 0,
                'options'         : {},
                'optionShortcuts' : {}
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
                    deflt       : opt[2], // default value
                    cast        : opt[3]  // casting function
                };

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
    },

    _assertHandlerExists: function (module, command) {
        if (!this._existsHandler(module, command)) {
            this.exitWithUsage('Invalid command');
        }
    },

    _assertOptionExists: function (module, command, opt) {
        if (utils.lang.isUndefined(this._moduleCommands[module][command].options[opt])) {
            this.exitWithCmdUsage('Invalid option provided \'--' + opt + '\'', module, command);
        }
    },

    _assertOptionShortcutExists: function (module, command, shortcut) {
        if (utils.lang.isUndefined(this._moduleCommands[module][command].optionShortcuts[shortcut])) {
            this.exitWithCmdUsage('Invalid option provided \'-' + shortcut + '\'', module, command);
        }
    }
});

module.exports = Engine;
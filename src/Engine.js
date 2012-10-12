var d  = require('dejavu'),
    fs = require('fs'),
    colors = require('colors') // https://github.com/Marak/colors.js
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
    _modulesDir: __dirname + '/modules/',
    _modules: [],

    initialize: function () {
        this._loadModules();
    },

    parse: function (argv) {
        if (argv.length < 4) {
            this.showUsage();
        }
    },

    run: function (module, command, options) {
        modules[module][task](options);
    },

    _loadModules: function () {
        var filenames = fs.readdirSync(this._modulesDir),
            module,
            i
        ;
        for (i in filenames) {
            module = filenames[i].split('.',1)[0];

            console.log(("Loading " + module).debug);

            this._modules[module] = require(this._modulesDir + module);
        }
    },

    showUsage: function () {
        console.log('Usage: bla bla bla'.info);
    },

    _existsHandler: function (module, command) {
        if (typeof this._modules[module][command] === 'Function') {
            return true;
        }

        return false;
    },

});

module.exports = Engine;
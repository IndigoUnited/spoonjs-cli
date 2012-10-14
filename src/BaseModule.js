var d      = require('dejavu'),
    Engine = require('./Engine'),
    utils  = require('amd-utils'),
    fs     = require('fs'),
    doT    = require('dot')
;

// keep spaces and line changes in templates
doT.templateSettings.strip = false;

var BaseModule = d.AbstractClass.declare({
    $name: 'BaseModule',
    _engine: null,
    __templateCache: {},

    initialize: function (engine) {
        // check if the engine is correct
        if (!d.instanceOf(engine, Engine)) {
            throw new Error('Module \'' + this.$name + '\' was not initialized correctly');
        }

        this._engine = engine;
    },

    $abstracts: {

        /* Example implementation:
        return {
            {
                'something': {
                    description: "Do something and what not. Note that the module must have a 'something' public method"
                    options: [
                        ['-s, --some-option [arg]', 'The option description. Note that is can have a optional arg', 'the default value for arg'],
                        ['-o, --other-option', 'This option does not have an arg'],
                    ]
                },
                'else <arg>': {
                    description: "Do something else. Note that the module must have a 'else' public method. Also, this 'else' command does not have options, although it has an 'arg' argument. This arg will be passed to the handler"
                }
            }
        };
        */
        getCommands: function () {}
    },

    _renderTemplate: function (filename, $args) {
        $args = $args || {};

        var tmpl = this.__getTemplate(filename);

        return tmpl($args);
    },

    __getTemplate: function (filename) {
        // find template real path
        try {
            var tmplPath = fs.realpathSync(filename);
        } catch (e) {
            throw new Error('Couldn\'t find template file "' + filename + '"');
        }

        // if template hasn't been compiled yet, compile and cache it
        if (utils.lang.isUndefined(this.__templateCache[tmplPath])) {
            this.__templateCache[tmplPath] = doT.template(fs.readFileSync(tmplPath, 'utf8'));
        }

        return this.__templateCache[tmplPath];
    },

    _parseBoolean: function (v) {
        if (/t|y|1|true|yes/.exec(v.toString())) {
            return true;
        }
        else if (/f|n|0|false|no/.exec(v.toString())) {
            return false;
        }

        throw new Error('Invalid boolean option'.error);
    }
});

module.exports = BaseModule;

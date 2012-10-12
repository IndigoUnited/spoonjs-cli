var d      = require('dejavu')
    Engine = require('./Engine')
;

var BaseModule = d.AbstractClass.declare({
    $name: 'BaseModule',
    _engine: null,

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
    }
});

module.exports = BaseModule;

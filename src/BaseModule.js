var d = require('dejavu')
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
    }
});

module.exports = new Framework;

var d          = require('dejavu'),
    BaseModule = require('../../BaseModule')
;

var Module = d.Class.declare({
    $name: 'Module',
    $extends: BaseModule,

    create: function (options, name) {
        console.log('creating module: ' + name);
    },

    test: function (options, name) {
        console.log('testing module: ' + name);
    },

    getCommands: function () {
        return {
            'create <name>': {
                description: "Create a new module"
            },
            'test <name>': {
                description: "Run the unit tests of the specified module"
            }
        };
    }
});

module.exports = Module;

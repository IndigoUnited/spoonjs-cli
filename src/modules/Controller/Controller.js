var d          = require('dejavu'),
    BaseModule = require('../../BaseModule')
;

var Controller = d.Class.declare({
    $name: 'Controller',
    $extends: BaseModule,


    create: function (options) {

    },

    getCommands: function () {
        return {
            'create <name>': {
                description: 'Create a new controller'
            }
        };
    }
});

module.exports = Controller;

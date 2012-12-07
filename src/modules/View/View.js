var d          = require('dejavu'),
    BaseModule = require('../../BaseModule')
;

var View = d.Class.declare({
    $name: 'View',
    $extends: BaseModule,

    create: function (options) {

    },

    getCommands: function () {
        return {
            'create <name>': {
                description: 'Create a new view'
            }
        };
    }
});

module.exports = View;

var d          = require('dejavu'),
    BaseModule = require('../BaseModule')
;

var Framework = d.Class.declare({
    $name: 'Framework',
    $extends: BaseModule,


    update: function () {

    },

    getCommands: function () {
        return {
            'update': {
                description: "Update the framework",
                options: [
                    ['-f, --force', 'Force updating into the latest version, regardless of it being backwards compatible']
                ]
            }
        };
    }
});

module.exports = Framework;

var d          = require('dejavu'),
    BaseModule = require('../BaseModule')
;

var Framework = d.Class.declare({
    $name: 'Framework',
    $extends: BaseModule,


    update: function (options) {
        // TODO: Things have to be discussed here
        //       - What happens if the generators have changed for some reason? Prompt the user to overwrite them?
        //       - What happens if the base directory structure changed sligtly?
    },

    getCommands: function () {
        return {
            /*'update': {
                description: 'Update the framework',
                options: [
                    ['-f, --force', 'Force updating into the latest version, regardless of it being backwards compatible']
                ]
            }*/
        };
    }
});

module.exports = Framework;

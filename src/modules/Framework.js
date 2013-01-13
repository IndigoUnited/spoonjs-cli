'use strict';

var d          = require('dejavu'),
    BaseModule = require('../BaseModule')
;

var Framework = d.Class.declare({
    $name: 'Framework',
    $extends: BaseModule,

    // TODO

    // --------------------------------------------------
    // --------------------------------------------------

    getCommands: function () {
        return {};
    }
});

module.exports = Framework;

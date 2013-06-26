'use strict';

var fs    = require('fs');
var utils = require('mout');

module.exports = function (dir) {
    var files,
        expectedFiles,
        commonFiles;

    try {
        files = fs.readdirSync(dir || process.cwd());
    } catch (e) {
        return false;
    }


    expectedFiles = ['app', 'src', 'web', 'tasks'];
    commonFiles = utils.array.intersection(files, expectedFiles);

    return utils.array.intersection(commonFiles, expectedFiles).length === expectedFiles.length;
};

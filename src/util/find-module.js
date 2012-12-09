var fs   = require('fs');
var path = require('path');
var glob = require('glob');

module.exports = function (location, dir) {
    // Check if location is already a valid location
    try {
        fs.statSync(location);
        return [location];
    } catch (e) {
        if (e.code !== 'ENOENT') {
            return [location];
        }
    }

    // Find out the module by name
    var srcFolder = path.join(dir || process.cwd(), 'src');

    try {
        return glob.sync(srcFolder + '/**/' + location, { nocase: true });
    } catch (e) {
        return [];
    }
};
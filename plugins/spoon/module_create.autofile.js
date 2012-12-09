/*jshint node:true, strict:false*/

var path       = require('path');
var utils      = require('amd-utils');
var glob       = require('glob');
var async      = require('async');
var fs         = require('fs');
var findModule = require(path.dirname(process.argv[1]) + '/../src/util/find-module');

var task = {
    id: 'spoon-module-create',
    name: 'SpoonJS module create',
    author: 'Indigo United',
    options: {
        name: {
            description : 'The name of the module'
        },
        location: {
            description: 'The location in which the module will be created',
            'default': path.join(process.cwd(), 'src/Application')
        }
    },
    filter: function (opts, next) {
        // Trim names ending with module and generate suitable names
        opts.name = opts.name.replace(/([_\-]?module)$/i, '');
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.slugify(opts.name.replace(/[_\-]/g, ' '));

        var cwd = path.normalize(process.cwd()),
            locations;

        // find the module according to the location
        locations = findModule(opts.location);
        if (!locations.length) {
            return next(new Error('Could not find suitable location for the module'));
        }
        if (locations.length > 1) {
            return next(new Error('Location is ambigous: ' + locations.join(', ')));
        }

        opts.dir = path.normalize(locations[0]);

        // location path must belong to the cwd
        if (opts.dir.indexOf(cwd) !== 0) {
            this._printError('Module location does not belong to the current working directory', 1);
        }

        // check if module already exists
        opts.dir = path.join(opts.dir, opts.name);
        if (!opts.force) {
            fs.stat(opts.dir, function (err) {
                if (!err || err.code !== 'ENOENT') {
                    return next(new Error(opts.dir + ' already exists'));
                }

                return next();
            });
        } else {
            next();
        }
    },
    tasks: [
        {
            task: 'mkdir',
            description: 'Create the module directory',
            options: {
                dir: '{{dir}}'
            }
        },
        {
            task: 'cp',
            description: 'Copy the structure of the module',
            options: {
                src: __dirname + '/module_structure',
                dst: '{{dir}}'
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename files based on the name of the module',
            options: {
                dir: '{{dir}}',
                data: {
                    name: '{{name}}',
                    hyphenated_name: '{{nameSlug}}'
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up files',
            options: {
                file: '{{dir}}/**/*',
                data: {
                    name: '{{name}}',
                    hyphenated_name: '{{nameSlug}}'
                }
            }
        },
        {
            task: function (opt, next) {
                glob(opt.dir + '/**/.gitkeep', function (err, files) {
                    if (err) {
                        return next(err);
                    }

                    async.forEach(files, function (file, next) {
                        fs.unlink(file, next);
                    }, next);
                });
            },
            description: 'Cleanup dummy files'
        }
    ]
};

module.exports = task;

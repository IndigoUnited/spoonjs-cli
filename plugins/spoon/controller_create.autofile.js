/*jshint node:true, strict:false*/

var path       = require('path');
var utils      = require('amd-utils');
var fs         = require('fs');
var findModule = require(path.dirname(process.argv[1]) + '/../src/util/find-module');

var task = {
    id: 'spoon-controller-create',
    name: 'SpoonJS controller create',
    author: 'Indigo United',
    options: {
        name: {
            description : 'The name of the controller'
        },
        location: {
            description: 'The location in which the controller will be created',
            'default': path.join(process.cwd(), 'src/Application')
        }
    },
    filter: function (opts, next) {
        // Trim names ending with module and generate suitable names
        opts.name = opts.name.replace(/([_\-]?controller)$/i, '');
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.slugify(opts.name.replace(/[_\-]/g, ' '));

        var cwd = path.normalize(process.cwd()),
            target,
            locations;

        // find the module according to the location
        locations = findModule(opts.location);
        if (!locations.length) {
            return next(new Error('Could not find suitable location for the controller'));
        }
        if (locations.length > 1) {
            return next(new Error('Location is ambigous: ' + locations.join(', ')));
        }

        opts.dir = path.normalize(locations[0]);

        // location path must belong to the cwd
        if (opts.dir.indexOf(cwd) !== 0) {
            this._printError('Controller location does not belong to the current working directory', 1);
        }

        // check if module already exists
        target = path.join(opts.dir, opts.name + 'Controller.js');
        if (!opts.force) {
            fs.stat(target, function (err) {
                if (!err || err.code !== 'ENOENT') {
                    return next(new Error(target + ' already exists'));
                }

                return next();
            });
        } else {
            next();
        }
    },
    tasks: [
        {
            task: 'cp',
            description: 'Copy the controller directory',
            options: {
                src: __dirname + '/controller_structure',
                dst: '{{dir}}'
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename files according to the name of the controller',
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
            description: 'Set up controller',
            options: {
                file: '{{dir}}/**/*',
                data: {
                    name: '{{name}}',
                    hyphenated_name: '{{nameSlug}}'
                }
            }
        }
    ]
};

module.exports = task;

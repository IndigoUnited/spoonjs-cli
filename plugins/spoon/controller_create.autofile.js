/*jshint node:true*/

'use strict';

var path  = require('path');
var utils = require('amd-utils');
var fs    = require('fs');

var task = {
    id: 'spoon-controller-create',
    name: 'SpoonJS controller create',
    author: 'Indigo United',
    description: 'Create controller',
    options: {
        name: {
            description : 'The name of the controller'
        },
        force: {
            description: 'Force the creation of the controller, even if it already exists',
            'default': false
        }
    },
    filter: function (opts, next) {
        // Get the location in which the the module will be created
        var cwd = path.normalize(process.cwd()),
            location = path.dirname(opts.name),
            target;

        // Trim trailing controller and extract only the basename
        opts.name = path.basename(opts.name.replace(/([_\-]?controller)$/i, ''));

        // Generate suitable name
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));

        if (location === '.') {
            return next(new Error('Please specify a folder for the controller (e.g. Application/' + opts.name + ')'));
        }
        if (location.charAt(0) !== '/') {
            location = '/src/' + location;
        }

        opts.dir = path.join(cwd, location);
        opts.__dirname = __dirname;

        // Check if create already exists
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
                files: {
                    '{{__dirname}}/controller_structure/*' : '{{dir}}'
                }
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename files according to the name of the controller',
            options: {
                dirs: '{{dir}}',
                data: {
                    name: '{{name}}'
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up controller',
            options: {
                files: '{{dir}}/**/*',
                data: {
                    name: '{{name}}',
                    hyphenated_name: '{{nameSlug}}'
                }
            }
        }
    ]
};

module.exports = task;

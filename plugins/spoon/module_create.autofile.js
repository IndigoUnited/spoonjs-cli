/*jshint node:true*/

'use strict';

var path  = require('path');
var utils = require('mout');
var fs    = require('fs');

var task = {
    id: 'spoon-module-create',
    name: 'SpoonJS module create',
    author: 'Indigo United',
    description: 'Create module',
    options: {
        name: {
            description : 'The name of the module'
        },
        force: {
            description: 'Force the creation of the module, even if it already exists',
            'default': false
        }
    },
    filter: function (opts, ctx, next) {
        // Get the location in which the the module will be created
        var cwd = path.normalize(process.cwd()),
            location = path.dirname(opts.name);

        // Extract only the basename
        opts.name = path.basename(opts.name, '.js');

        // Validate name
        if (/[^a-z0-9_\-\.]/i.test(opts.name)) {
            return next(new Error('"' + opts.name + '" contains unallowed chars'));
        }

        // Generate suitable names
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.underscore(opts.name);

        if (location.charAt(0) !== '/') {
            location = '/src/' + location;
        }

        opts.dir = path.join(cwd, location, opts.name);
        opts.__dirname = __dirname;

        // Check if module already exists
        if (!opts.force) {
            fs.stat(opts.dir, function (err) {
                if (!err || err.code !== 'ENOENT') {
                    return next(new Error('"' + opts.name + '" already exists'));
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
            description: 'Copy the structure of the module',
            options: {
                files: {
                    '{{__dirname}}/module_structure/**/*' : '{{dir}}'
                },
                glob: {
                    dot: true
                }
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename files based on the name of the module',
            options: {
                files: '{{dir}}/**/*',
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
                files: '{{dir}}/**/*',
                data: {
                    name: '{{name}}',
                    hyphenated_name: '{{nameSlug}}'
                }
            }
        },
        {
            task: 'rm',
            description: 'Cleanup dummy files',
            options: {
                files: '{{dir}}/**/.gitkeep'
            }
        }
    ]
};

module.exports = task;

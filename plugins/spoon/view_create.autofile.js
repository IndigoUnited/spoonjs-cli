/*jshint node:true*/

'use strict';

var path  = require('path');
var utils = require('amd-utils');
var fs    = require('fs');

var task = {
    id: 'spoon-view-create',
    name: 'SpoonJS view create',
    author: 'Indigo United',
    description: 'Create view',
    options: {
        name: {
            description : 'The name of the view'
        },
        force: {
            description: 'Force the creation of the view, even if it already exists',
            'default': false
        }
    },
    filter: function (opts, ctx, next) {
        // Get the location in which the the module will be created
        var cwd = path.normalize(process.cwd()),
            location = path.dirname(opts.name),
            target;

        // Extract only the basename
        opts.name = path.basename(opts.name);

        // Validate name
        if (/[^a-z0-9_\-\.]/i.test(opts.name)) {
            return next(new Error('"' + opts.name + '" contains unallowed chars'));
        }

        // Trim trailing view and generate suitable names
        opts.name = path.basename(opts.name.replace(/([_\-]?view)$/i, ''), '.js');
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.underscore(opts.name);

        if (location === '.') {
            return next(new Error('Please specify a folder for the view (e.g. Application/' + opts.name + ')'));
        }
        if (location.charAt(0) !== '/') {
            location = '/src/' + location;
        }

        opts.dir = path.join(cwd, location);
        opts.__dirname = __dirname;

        // Check if create already exists
        target = path.join(opts.dir, opts.name + 'View.js');
        if (!opts.force) {
            fs.stat(target, function (err) {
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
            description: 'Copy the view directory',
            options: {
                files: {
                    '{{__dirname}}/view_structure/**/*' : '{{dir}}'
                },
                glob: {
                    dot: true
                }
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename files according to the name of the view',
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
            description: 'Set up view',
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

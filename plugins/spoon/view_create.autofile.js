/*jshint node:true, strict:false*/

var path  = require('path');
var utils = require('amd-utils');
var fs    = require('fs');

var task = {
    id: 'spoon-view-create',
    name: 'SpoonJS view create',
    author: 'Indigo United',
    options: {
        name: {
            description : 'The name of the view'
        },
        force: {
            description: 'Force the creation of the view, even if it already exists',
            'default': false
        }
    },
    filter: function (opts, next) {
        // Trim trailing view
        opts.name = opts.name.replace(/([_\-]?view)$/i, '');

        // Get the location in which the the module will be created
        var cwd = path.normalize(process.cwd()),
            location = path.dirname(opts.name),
            target;

        if (location.charAt(0) !== '/') {
            location = '/src/Application/' + location;
        }

        opts.dir = path.join(cwd, location);
        opts.name = path.basename(opts.name);

        // Generate suitable names
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.slugify(opts.name.replace(/[_\-]/g, ' '));

        opts.__dirname = __dirname;

        // Check if create already exists
        target = path.join(opts.dir, opts.name + 'View.js');
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
            description: 'Copy the view directory',
            options: {
                files: {
                    '{{__dirname}}/view_structure/*' : '{{dir}}'
                }
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename files according to the name of the view',
            options: {
                dirs: '{{dir}}',
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

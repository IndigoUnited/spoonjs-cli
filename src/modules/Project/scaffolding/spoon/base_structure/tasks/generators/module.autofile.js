/*jshint node:true, strict:false*/

var path  = require('path');
var utils = require('amd-utils');
var glob  = require('glob');
var async = require('async');
var fs    = require('fs');

var task = {
    id: 'spoon-module-create',
    name: 'SpoonJS module create',
    author: 'Indigo United',
    filter: function (opts) {
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.slugify(opts.name);
        opts.dir = path.join(opts.location, opts.name);
    },
    options: {
        name: {
            description : 'The name of the module'
        },
        location: {
            description: 'The location in which the module will be created',
            'default': path.join(process.cwd(), 'src/Application')
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
            description: 'Copy the base structure of the module',
            options: {
                src: path.join(process.cwd(), 'tasks/generators/module'),
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

'use strict';

var path            = require('path');
var fs              = require('fs');
var isProject       = require('../../src/util/is-project');
var baseLibrary     = require('../base_library/setup.js');
var templateLibrary = require('../template_library/setup.js');

var task = {
    id: 'spoon-scaffold',
    name: 'SpoonJS scaffolding',
    author: 'Indigo United',
    description: 'Create a spoon project',
    options: {
        dir: {
            description : 'The destination folder where the project should be scaffolded',
            'default': process.cwd()
        },
        name: {
            description: 'The project name (defaults to the basename of the dir)'
        },
        force: {
            description: 'Force the creation of the project, even if a spoon project is already created',
            'default': false
        }
    },
    filter: function (opts, ctx, next) {
        opts.name = opts.name || path.basename(opts.dir);

        // Validate name
        if (/[^a-z0-9_\-\.]i/.test(opts.name)) {
            return next(new Error('"' + opts.name + '" contains unallowed chars'));
        }

        opts.__dirname = __dirname;

        fs.readdir(opts.dir, function (err, files) {
            if (err) {
                return next(new Error('"' + opts.dir + '" is not a valid or writable directory'));
            }

            // If directory is empty, create project there
            // Otherwise the folder is the project name
            if (files.length) {
                opts.dir = path.join(opts.dir, opts.name);
                opts.createDir = false;
            }

            opts.isProject = isProject(opts.dir);

            // Check if directory is already a spoon project
            if (!opts.force && opts.isProject) {
                return next(new Error('"' + opts.dir + '" seems to be already a spoon project (use the force option to proceed)'));
            }

            next();
        });
    },
    tasks: [
        {
            task: 'mkdir',
            description: 'Create the project root folder',
            options: {
                dirs: '{{dir}}'
            },
            on: function (opts) {
                return !opts.isProject && opts.createDir;
            }
        },
        {
            task: 'cp',
            description: 'Copy the structure of the project',
            options: {
                files: {
                    '{{__dirname}}/project_structure/**/*': '{{dir}}'
                },
                glob: {
                    dot: true
                }
            }
        },
        {
            task: 'cp',
            description: 'Copy generators',
            options: {
                files: {
                    '{{__dirname}}/!(project_*)': '{{dir}}/tasks/generators',
                    '{{__dirname}}/!(project_*)**/*': '{{dir}}/tasks/generators'
                },
                glob: {
                    dot: true
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Saving project name',
            options: {
                files: [
                    '{{dir}}/*',
                    '{{dir}}/web/index*'
                ],
                data: {
                    page_title: '{{name}}',
                    name: '{{name}}'
                }
            }
        },
        {
            task: 'mv',
            description: 'Rename the gitignore file',
            options: {
                files: {
                    '{{dir}}/gitignore': '{{dir}}/.gitignore'
                }
            }
        },
        {
            task: baseLibrary,
            description: 'Setup up base library',
            options: {
                name: 'jquery',
                dir: '{{dir}}'
            }
        },
        {
            task: templateLibrary,
            description: 'Setup up template library',
            options: {
                name: 'handlebars',
                dir: '{{dir}}'
            }
        },
        {
            task: {
                tasks: [
                    {
                        task: 'scaffolding-close',
                        options: {
                            files: '{{dir}}/app/bootstrap.js',
                            placeholders: ['shim', 'packages']
                        },
                        description: null
                    },
                    {
                        task: function (opts, ctx, next) {
                            // Fix trailing commas
                            var file = opts.dir + '/app/bootstrap.js';
                            fs.readFile(file, function (err, contents) {
                                if (err) {
                                    return next(err);
                                }

                                contents = contents.toString().replace(/,([\s\n\r]*\})/gm, '$1');

                                fs.writeFile(file, contents, next);
                            });
                        },
                        description: null
                    }
                ]
            },
            description: 'Finish up loader config',
            options: {
                dir: '{{dir}}'
            }
        },
        {
            task: 'scaffolding-close',
            description: 'Finish up index files',
            options: {
                files: '{{dir}}/web/index*.html',
                placeholders: [
                    'html_first',
                    'html_last',
                    'head_first',
                    'head',
                    'head_last',
                    'body_first',
                    'body_before_bootstrap',
                    'body_after_bootstrap',
                    'body',
                    'body_last'
                ]
            }
        },
        {
            task: 'rm',
            description: 'Remove unnecessary files',
            options: {
                files: '{{dir}}/**/.gitkeep'
            }
        },
        {
            task: 'run',
            description: 'Install client environment dependencies',
            options: {
                // TODO: bower should be called programatically?
                //       this would avoid having a global dependency on bower
                //       on the other hand.. its a good idea to force the user to install
                //       bower because it will be used as package manager for every project
                cmd: 'bower install',
                cwd: '{{dir}}'
            }
        },
        {
            task: 'run',
            description: 'Install node environment dependencies',
            options: {
                // TODO: should npm be called programatically?
                cmd: 'npm install',
                cwd: '{{dir}}'
            }
        },
        {
            task: 'rm',
            description: 'Cleanup files',
            options: {
                files: '.dejavurc'
            }
        }
    ]
};

module.exports = task;

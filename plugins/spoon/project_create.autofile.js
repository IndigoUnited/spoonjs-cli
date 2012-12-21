var path      = require('path');
var fs        = require('fs');
var isProject = require('../../src/util/is-project');

var task = {
    id: 'spoon-scaffold',
    name: 'SpoonJS scaffolding',
    author: 'Indigo United',
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
    filter: function (opts, next) {
        opts.name = opts.name || path.basename(opts.dir);
        fs.readdir(opts.dir, function (err, files) {
            if (err) {
                return next(new Error(opts.dir + ' is not a valid or writable directory'));
            }

            // If directory is empty, create project there
            // Otherwise the folder is the project name
            if (files.length) {
                opts.dir = path.join(opts.dir, opts.name);
            }

            // Check if directory is already a spoon project
            if (!opts.force && isProject(opts.dir)) {
                return next(new Error(opts.dir + ' seems to be already a spoon project (use the force option to proceed)'));
            }

            next();
        });
        opts.__dirname = __dirname;
    },
    tasks: [
        {
            task: 'mkdir',
            description: 'Create the project root folder',
            options: {
                dirs: '{{dir}}'
            }
        },
        {
            task: 'cp',
            description: 'Copy the structure of the project',
            options: {
                files: {
                    '{{__dirname}}/project_structure/*': '{{dir}}'
                },
                glob: {
                    dot: true
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up files',
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
            task: 'scaffolding-close',
            description: 'Finish files setup',
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
            task: 'cp',
            description: 'Copy generators',
            options: {
                files: {
                    '{{__dirname}}/*': '{{dir}}/tasks/generators'
                }
            }
        },
        {
            task: 'rm',
            description: 'Clean up files',
            options: {
                files: [
                    '{{dir}}/tasks/generators/project_*',
                    '{{dir}}/**/.gitkeep'
                ]
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
        }
    ]
};

module.exports = task;

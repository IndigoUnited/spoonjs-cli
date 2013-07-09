'use strict';

var path            = require('path');
var fs              = require('fs');
var isProject       = require('../../src/util/isProject');
var baseLibrary     = require('../base_library/setup.js');
var templateLibrary = require('../template_library/setup.js');

module.exports = function (task) {
    task
    .id('spoon-scaffold')
    .name('SpoonJS scaffolding')
    .author('Indigo United')
    .description('Create a spoon project')
    .option('dir', 'The destination folder where the project should be scaffolded', process.cwd())
    .option('name', 'The project name (defaults to the basename of the dir)')
    .option('force', 'Force the creation of the project, even if a SpoonJS project is alread created', false)

    .setup(function (opts, ctx, next) {
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
    })

    .do('mkdir', {
        description: 'Create the project root folder',
        options: {
            dirs: '{{dir}}'
        },
        on: function (opts) {
            return !opts.isProject && opts.createDir;
        }
    })
    .do('cp', {
        description: 'Copy the structure of the project',
        options: {
            files: {
                '{{__dirname}}/project_structure/**/*': '{{dir}}'
            },
            glob: {
                dot: true
            }
        }
    })
    .do('cp', {
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
    })
    .do('scaffolding-replace', {
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
    })
    .do('mv', {
        description: 'Rename the gitignore file',
        options: {
            files: {
                '{{dir}}/gitignore': '{{dir}}/.gitignore'
            }
        }
    })
    .do(baseLibrary, {
        description: 'Setup up base library',
        options: {
            name: 'jquery',
            dir: '{{dir}}'
        }
    })
    .do(templateLibrary, {
        description: 'Setup up template library',
        options: {
            name: 'doT',
            dir: '{{dir}}'
        }
    })
    .do('scaffolding-close', {
        description: 'Closing loader placeholders (loader.js)',
        options: {
            files: '{{dir}}/app/loader.js',
            placeholders: ['shim', 'paths', 'packages']
        },
    })
    .do(function (opts, ctx, next) {
        // Fix trailing commas
        var file = opts.dir + '/app/loader.js';
        fs.readFile(file, function (err, contents) {
            if (err) {
                return next(err);
            }

            contents = contents.toString().replace(/,([\s\n\r]*\})/gm, '$1');

            fs.writeFile(file, contents, next);
        });
    }, {
        description: 'Fixing loader format (loader.js)'
    })
    .do('scaffolding-close', {
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
    })
    .do('rm', {
        description: 'Remove unnecessary files',
        options: {
            files: '{{dir}}/**/.gitkeep'
        }
    })
    .do('run', {
        description: 'Install client environment dependencies',
        options: {
            // TODO: bower should be called programatically?
            //       this would avoid having a global dependency on bower
            //       on the other hand.. its a good idea to force the user to install
            //       bower because it will be used as package manager for every project
            cmd: 'bower install',
            cwd: '{{dir}}'
        }
    })
    .do('run', {
        description: 'Install node environment dependencies',
        options: {
            // TODO: should npm be called programatically?
            cmd: 'npm install',
            cwd: '{{dir}}'
        }
    })
    .do('rm', {
        description: 'Cleanup files',
        options: {
            files: '.dejavurc'
        }
    });
};

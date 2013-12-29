/*jshint node:true*/

'use strict';

module.exports = function (task) {
    task
    .id('base-library-setup')
    .name('SpoonJS base library setup')
    .author('Indigo United')
    .description('Setups the base library for a new SpoonJS project')
    .option('dir', 'The location of the project')
    .option('name', 'The name of the base library to use. Can be one of these: jquery, mootools, yui3, dojo.', 'jquery')

    .setup(function (opts, ctx, next) {
        switch (opts.name) {
        case 'jquery':
            opts.endpoint = '^1.9||~2.0.0';
            opts.varName = '$';
            opts.ready = '$(document.body).ready';
            break;
        case 'yui3':
        case 'mootools':
        case 'yui3':
        case 'dojo':
            return next(new Error('Base library not yet supported'));
        default:
            return next(new Error('Unknown base library specified'));
        }

        next();
    })

    .do('scaffolding-replace', {
        description: 'Setup the bower.json',
        options: {
            files: '{{dir}}/bower.json',
            data: {
                baseLibrary: '{{name}}',
                baseLibraryEndpoint: '{{endpoint}}'
            }
        }
    })
    .do('scaffolding-replace', {
        description: 'Setup src files and generators',
        options: {
            files: ['{{dir}}/tasks/generators/**/*', '{{dir}}/src/**/*', '{{dir}}/app/**/*'],
            data: {
                baseLibrary: '{{name}}',
                baseLibraryVar: '{{varName}}',
                baseLibraryReady: '{{ready}}'
            }
        }
    })
    .do('scaffolding-append', {
        description: 'Setup loader paths (loader.js)',
        options: {
            files: '{{dir}}/app/loader.js',
            type: 'file',
            data: {
                paths: __dirname + '/templates/{{name}}.path.tmpl'
            }
        }
    })
    .do('scaffolding-append', {
        description: 'Setup loader shims (loader.js)',
        options: {
            files: '{{dir}}/app/loader.js',
            type: 'file',
            data: {
                shim: __dirname + '/templates/{{name}}.shim.tmpl'
            }
        }
    });
};

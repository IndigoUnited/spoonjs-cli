/*jshint node:true*/

'use strict';

module.exports = function (task) {
    task
    .id('base-library-setup')
    .name('SpoonJS template library setup')
    .author('Indigo United')
    .description('Setups the template library for a new SpoonJS project')
    .option('dir', 'The location of the project')
    .option('name', 'The name of the template library to use. Can be one of these: handlebars, doT', 'handlebars')

    .setup(function (opts, ctx, next) {
        switch (opts.name) {
        case 'handlebars':
            opts.endpoint = '~1.0.0';
            opts.varName = 'Handlebars';
            opts.compileFunc = 'compile';
            break;
        case 'doT':
            opts.endpoint = '~1.0.1';
            opts.varName = 'doT';
            opts.compileFunc = 'template';
            break;
        default:
            return next(new Error('Unknown template library specified'));
        }

        next();
    })

    .do('scaffolding-replace', {
        description: 'Setup the bower.json',
        options: {
            files: '{{dir}}/bower.json',
            data: {
                templateLibrary: '{{name}}',
                templateLibraryEndpoint: '{{endpoint}}'
            }
        }
    })
    .do('scaffolding-replace', {
        description: 'Setup src files and generators',
        options: {
            files: ['{{dir}}/tasks/generators/**/*', '{{dir}}/src/**/*'],
            data: {
                templateLibrary: '{{name}}',
                templateLibraryVar: '{{varName}}',
                templateLibraryCompileFunc: '{{compileFunc}}'
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

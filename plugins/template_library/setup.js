/*jshint node:true*/

'use strict';

var fs = require('fs');

var task = {
    id: 'base-library-setup',
    name: 'SpoonJS base library setup',
    author: 'Indigo United',
    description: 'Setups the template library for a new SpoonJS project',
    options: {
        dir: {
            description: 'The location of the project'
        },
        name: {
            description : 'The name of the template library to use. Can be one of these: handlebars, doT',
            'default': 'handlebars'
        }
    },
    filter: function (opts, ctx, next) {
        var path = '../vendor';

        switch (opts.name) {
        case 'handlebars':
            opts.endpoint = '~1.0.0';
            opts.varName = 'Handlebars';
            opts.compileFunc = 'compile';
            path += '/handlebars/handlebars';
            break;
        case 'doT':
            opts.endpoint = '~0.2.0';
            opts.varName = 'doT';
            opts.compileFunc = 'template';
            path += '/doT/doT';
            break;
        }

        opts.path = path;

        fs.stat(__dirname + '/shims/' + opts.name, function (err) {
            opts.needsShim = !err || err.code !== 'ENOENT';
            next();
        });
    },
    tasks: [
        {
            task: 'scaffolding-replace',
            description: 'Setup the component.json',
            options: {
                files: '{{dir}}/component.json',
                data: {
                    templateLibrary: '{{name}}',
                    templateLibraryEndpoint: '{{endpoint}}'
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Setup src files and generators',
            options: {
                files: ['{{dir}}/tasks/generators/**/*', '{{dir}}/src/**/*'],
                data: {
                    templateLibrary: '{{name}}',
                    templateLibraryVar: '{{varName}}',
                    templateLibraryCompileFunc: '{{compileFunc}}'
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Setup loader paths (bootstrap.js)',
            options: {
                files: '{{dir}}/app/bootstrap.js',
                data: {
                    templateLibrary: '{{name}}',
                    templateLibraryPath: '{{path}}'
                }
            }
        },
        {
            task: 'scaffolding-append',
            description: 'Setup loader shims (bootstrap.js)',
            options: {
                files: '{{dir}}/app/bootstrap.js',
                type: 'file',
                data: {
                    shim: __dirname + '/shims/{{name}}'
                }
            },
            on: '{{needsShim}}'
        }
    ]
};

module.exports = task;

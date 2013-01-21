/*jshint node:true*/

'use strict';

var task = {
    id: 'base-library-setup',
    name: 'SpoonJS base library setup',
    author: 'Indigo United',
    description: 'Setups the base library for a new SpoonJS project',
    options: {
        dir: {
            description: 'The location of the project'
        },
        name: {
            description : 'The name of the base library to use. Can be one of these: jquery, mootools, yui3, dojo.',
            'default': 'jquery'
        }
    },
    filter: function (opts, ctx, next) {
        var path = '../vendor';

        switch (opts.name) {
        case 'jquery':
            opts.endpoint = '~1.8.2';
            opts.varName = '$';
            path += '/jquery/jquery';
            break;
        case 'mootools':
            opts.endpoint = '~1.8.2';
            opts.varName = 'mootools';
            path += '/mootools/mootools';
            break;
        case 'yui3':
            opts.endpoint = '~1.8.2';
            opts.varName = 'Y';
            path += '/yui3/yui3';
            break;
        case 'dojo':
            opts.endpoint = '~1.8.2';
            opts.varName = 'dojo';
            path += '/dojo/dojo';
            break;
        }

        opts.path = path;

        next();
    },
    tasks: [
        {
            task: 'scaffolding-replace',
            description: 'Setup the component.json',
            options: {
                files: '{{dir}}/component.json',
                data: {
                    baseLibrary: '{{name}}',
                    baseLibraryEndpoint: '{{endpoint}}'
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Setup src files and generators',
            options: {
                files: ['{{dir}}/tasks/generators/**/*', '{{dir}}/src/**/*'],
                data: {
                    baseLibrary: '{{name}}',
                    baseLibraryVar: '{{varName}}'
                }
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Setup loader (bootstrap.js)',
            options: {
                files: '{{dir}}/app/bootstrap.js',
                data: {
                    baseLibrary: '{{name}}',
                    baseLibraryPath: '{{path}}'
                }
            }
        }
    ]
};

module.exports = task;

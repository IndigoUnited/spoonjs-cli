var path  = require('path');
var utils = require('amd-utils');

var task = {
    id: 'spoon-module-create',
    name: 'SpoonJS module create',
    author: 'Indigo United',
    filter: function (opts) {
        //opts.location = path.resolve(process.cwd(), opts.location);
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.slugify(opts.dir);
        opts.dir = path.join(opts.location, opts.name);

        // TODO: abort if the folder already exists
    },
    options: {
        name: {
            description : 'The name of the module',
            'default': ''
        },
        location: {
            description: 'The location which the module will be created',
            'default': 'dsadsa'
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
                src: path.join(process.cwd(), 'app/generators/module'),
                dst: '{{dir}}'
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename files based on the name of the module',
            options: {
                dir: '{{dir}}'
            }
        }
    ]
};

module.exports = task;

var path  = require('path');
var utils = require('amd-utils');

var task = {
    id: 'spoon-controller-create',
    name: 'SpoonJS controller create',
    author: 'Indigo United',
    filter: function (opts) {
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.slugify(opts.name);
        opts.dir = path.join(opts.location, opts.name);
    },
    options: {
        name: {
            description : 'The name of the controller'
        },
        location: {
            description: 'The location in which the controller will be created',
            'default': path.join(process.cwd(), 'src/Application')
        }
    },
    tasks: [
        {
            task: 'mkdir',
            description: 'Create the controller directory',
            options: {
                dir: '{{dir}}'
            }
        },
        {
            task: 'cp',
            description: 'Copy the controller',
            options: {
                src: path.join(process.cwd(), 'app/generators/module'),
                dst: '{{dir}}'
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename the controller',
            options: {
                dir: '{{dir}}/{{name}}Controller.js',
                what: 'name',
                'with': '{{name}}'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up controller',
            options: {
                what: '{{dir}}/{{name}}Controller.js:name',
                'with': '{{name}}',
                type: 'string'
            }
        }
    ]
};

module.exports = task;

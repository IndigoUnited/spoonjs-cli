var path  = require('path');
var utils = require('amd-utils');

var task = {
    id: 'spoon-view-create',
    name: 'SpoonJS view create',
    author: 'Indigo United',
    filter: function (opts) {
        opts.name = utils.string.pascalCase(opts.name.replace(/_/g, '-'));
        opts.nameSlug = utils.string.slugify(opts.name);
        opts.dir = path.join(opts.location, opts.name);
    },
    options: {
        name: {
            description : 'The name of the view'
        },
        location: {
            description: 'The location in which the view will be created',
            'default': path.join(process.cwd(), 'src/Application')
        }
    },
    tasks: [
        {
            task: 'mkdir',
            description: 'Create the view directory',
            options: {
                dir: '{{dir}}'
            }
        },
        {
            task: 'cp',
            description: 'Copy the view',
            options: {
                src: path.join(process.cwd(), 'app/generators/module'),
                dst: '{{dir}}'
            }
        },
        {
            task: 'scaffolding-file-rename',
            description: 'Rename the view',
            options: {
                dir: '{{dir}}/{{name}}View.js',
                what: 'name',
                'with': '{{name}}'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up view',
            options: {
                what: '{{dir}}/{{name}}View.js:name',
                'with': '{{name}}',
                type: 'string'
            }
        }
    ]
};

module.exports = task;

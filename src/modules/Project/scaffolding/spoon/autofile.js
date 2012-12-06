var path = require('path');

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
        }
    },
    filter: function (opt) {
        opt.name = opt.name || path.basename(opt.dir);
    },
    tasks: [
        {
            task: 'mkdir',
            description: 'Create the project root folder',
            options: {
                dir: '{{dir}}'
            }
        },
        {
            task: 'cp',
            description: 'Copy the base structure of the project',
            options: {
                src: __dirname + '/base_structure',
                dst: '{{dir}}'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up Bower component file',
            options: {
                what: '{{dir}}/component.json:name',
                'with': '{{name}}',
                type: 'string'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up README file',
            options: {
                what: '{{dir}}/README.md:name',
                'with': '{{name}}',
                type: 'string'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up index file',
            options: {
                what: '{{dir}}/web/index.html:page_title',
                'with': '{{name}}',
                type: 'string'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up index file (prod environment)',
            options: {
                what: '{{dir}}/web/index_prod.html:page_title',
                'with': '{{name}}',
                type: 'string'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up index file (staging environment)',
            options: {
                what: '{{dir}}/web/index_staging.html:page_title',
                'with': '{{name}}',
                type: 'string'
            }
        },
        {
            on: '{{dir}}',
            task: 'run',
            description: 'Install client environment dependencies',
            options: {
                // TODO: bower should be called programatically?
                cmd: 'bower install',
                cwd: '{{dir}}'
            }
        },
        {
            on: '{{dir}}',
            task: 'run',
            description: 'Install node environment dependencies',
            options: {
                cmd: 'npm install',
                cwd: '{{dir}}'
            }
        }
    ]
};

module.exports = task;

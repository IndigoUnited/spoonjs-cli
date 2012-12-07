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
            description: 'Set up files',
            options: {
                file: [
                    '{{dir}}/component.json',
                    '{{dir}}/package.json',
                    '{{dir}}/README.md',
                    '{{dir}}/web/index.html',
                    '{{dir}}/web/index_prod.html',
                    '{{dir}}/web/index_staging.html',
                    '{{dir}}/web/index.html',
                    '{{dir}}/web/index_prod.html',
                    '{{dir}}/web/index_staging.html'
                ],
                data: {
                    page_title: '{{name}}',
                    name: '{{name}}'
                }
            }
        },
        {
            task: 'scaffolding-close',
            description: 'Clean files',
            options: {
                file: [
                    '{{dir}}/web/index.html',
                    '{{dir}}/web/index_prod.html',
                    '{{dir}}/web/index_staging.html'
                ],
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
        }/*,
        {
            task: 'run',
            description: 'Install client environment dependencies',
            options: {
                // TODO: bower should be called programatically?
                cmd: 'bower install',
                cwd: '{{dir}}'
            }
        },
        {
            task: 'run',
            description: 'Install node environment dependencies',
            options: {
                cmd: 'npm install',
                cwd: '{{dir}}'
            }
        }*/
    ]
};

module.exports = task;

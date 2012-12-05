var task = {
    id: 'spoon-scaffold',
    name: 'SpoonJS scaffolding',
    author: 'Indigo United',
    options: {
        dir: {
            description : 'The destination folder where the project should be scaffolded',
            'default': process.cwd()
        },
        title: {
            description: 'The project title',
            'default': 'New project'
        }
    },
    filter: function (opt) {
        // TODO: check if destination folder already exists, and has contents
        // TODO: add some basic questions and modify project accordingly:
        //       - What base library to use
        //       - What template system to use
        //       - What css pre-processor to use

        opt.dir = opt.dir || opt.title;
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
                what: '{{dir}}/component.json:title',
                'with': '{{title}}',
                type: 'string'
            }
        },
        {
            task: 'scaffolding-replace',
            description: 'Set up README file',
            options: {
                what: '{{dir}}/README.md:title',
                'with': '{{title}}',
                type: 'string'
            }
        },
        {
            on: '{{dir}}',
            task: 'run',
            description: 'Install dependencies',
            options: {
                // TODO: bower should be called programatically
                cmd: 'bower install',
                cwd: '{{dir}}'
            }
        }
    ]
};

module.exports = task;

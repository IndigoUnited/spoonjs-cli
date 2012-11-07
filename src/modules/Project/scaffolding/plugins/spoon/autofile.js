var task = {
    id: 'spoon_scaffold',
    name: 'SpoonJS scaffolding',
    author: 'Indigo United',
    options: {
        dst: {
            description : 'The destination folder where the project should be scaffolded'
        }
    },
    tasks: [
        {
            task: 'mkdir',
            description: 'create the project root folder',
            options: {
                dir: '{{dst}}'
            }
        },
        {
            task: 'cp',
            description: 'Copy the base structure of the project',
            options: {
                src: __dirname + '/base_structure',
                dst: '{{dst}}'
            }
        }
    ]
};

module.exports = task;

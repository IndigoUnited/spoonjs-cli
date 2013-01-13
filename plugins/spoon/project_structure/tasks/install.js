/*jshint node:true*/

'use strict';

var task = {
    id: 'project-install',
    name: 'Project installation',
    author: 'Indigo United',
    description: 'Install project dependencies',
    tasks: [
        {
            task: 'run',
            description: 'Install client environment dependencies',
            options: {
                // TODO: bower should be called programatically?
                //       this would avoid having a global dependency on bower
                //       on the other hand.. its a good idea to force the user to install
                //       bower because it will be used as package manager for every project
                cmd: 'bower install'
            }
        },
        {
            task: 'run',
            description: 'Install node environment dependencies',
            options: {
                // TODO: should npm be called programatically?
                cmd: 'npm install'
            }
        },
        {
            task: 'rm',
            description: 'Cleanup files',
            options: {
                files: '.dejavurc'
            }
        }
    ]
};

module.exports = task;

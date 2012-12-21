/*jshint node:true, strict:false, latedef:false */

var fs        = require('fs');
var path      = require('path');
var express   = require('express');

var task = {
    id: 'server',
    name: 'Server',
    author: 'Indigo United',
    options: {
        env: {
            description: 'The environment that the server will run',
            'default': 'dev'
        },
        favicon: {
            description: 'The favicon path',
            'default': './favicon.ico'
        },
        index: {
            description: 'The index file to use (defaults to the index according to the environment)'
        },
        rewrite: {
            description: 'Enable or disable URL rewrite (in order to pushState to work)',
            'default': true
        },
        port: {
            description: 'The port listen for requests',
            'default': 8000
        },
        host: {
            description: 'The host to listen for requests',
            'default': '127.0.0.1'
        }
    },
    filter: function (options, next) {
        if (!options.index) {
            options.index = options.env === 'dev' ? './index.html' : './index_' + options.env + '.html';
        }

        if (options.env === 'dev') {
            options.rootSymlink = true;
            options.rewrite = false;
            options.assetsDir = 'root';
        } else {
            options.assetsDir = options.env;
        }

        next();
    },
    tasks: [
        {
            task: function (options, next) {
                // Change cwd to the web folder
                process.chdir('web');
                var web = process.cwd(),
                    env = options.env,
                    root;

                // Check if the env is valid
                try {
                    fs.statSync(options.index);
                } catch (e) {
                    if (e.code === 'ENOENT') {
                        return next(new Error('Invalid environment: ' + env));
                    }
                }

                options.web = web;

                // Create root symlink
                if (options.rootSymlink) {
                    root = path.join(web, 'root');
                    try {
                        fs.statSync(root);
                    } catch (e) {
                        fs.symlinkSync(path.resolve(web, '..'), root, 'dir');
                    }
                }

                try {
                    fs.statSync(options.assetsDir);
                } catch (e) {
                    if (e.code === 'ENOENT') {
                        return next(new Error('Assets dir not found, did you forgot to build?'));
                    }
                }

                next();
            },
            description: 'Prepare server'
        },
        {
            task: function (options) {
                // Check if assets dir exists
                var site = express();

                // Serve index
                site.get('/', function (req, res) {
                    return res.sendfile(options.index);
                });

                // Serve favicon.ico
                site.use(express.favicon(options.favicon));

                // Serve files & folders
                site.get('/*', function (req, res) {
                    // Get the requested file
                    // If there are query parameters, remove them
                    var file = path.join(options.web, req.url.substr(1));
                    file = file.split('?')[0];

                    fs.stat(file, function (err, stat) {
                        // If file does not exists, serve 404 page
                        if (err && err.code === 'ENOENT') {
                            serve404(options, res);
                        // If it exists and is a file, serve it
                        } else if (stat.isFile()) {
                            res.sendfile(file);
                        // Otherwise is a folder, so we deny the access
                        } else {
                            res.send(403);
                        }
                    });
                });

                // Effectively listen
                site.listen(options.port, options.host);
                console.log('Listening on http://' + (options.host === '127.0.0.1' ? 'localhost' : options.host) + ':' + options.port + ' (' + options.env + ' environment)');
            },
            description: 'Serve files'
        }
    ]
};

/**
 * Serve 404 page.
 *
 * @param {Object} The task options
 * @param {Object} The express response object
 */
function serve404(options, res) {
    // If the rewrite is disabled, we attempt to serve the 404.html page
    // Otherwise we rewrite to the front controller (index)
    if (!options.rewrite) {
        var file404 = path.join(options.web, '404.html');
        fs.stat(file404, function (err) {
            if (!err) {
                res.status(404);
                res.sendfile('404.html');
            } else {
                res.send(404);
            }
        });
    } else {
        res.sendfile(options.index);
    }
}

module.exports = task;
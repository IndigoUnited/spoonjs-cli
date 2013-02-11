/*jshint node:true, es5:true, regexp:false*/

'use strict';

var fs        = require('fs');
var rjs       = require('requirejs');
var dejavuOpt = require('dejavu/tasks/optimizer.autofile');
var UglifyJS  = require('uglify-js');
var cleanCSS  = require('clean-css');
var gzip      = require('gzip-js');

var task = {
    id: 'build',
    name: 'Build',
    author: 'Indigo United',
    description: 'Build project',
    options: {
        env: {
            description: 'The environment to build',
            default: 'prod'
        },
        dejavu: {
            description: 'Optimize dejavu usages',
            default: true
        }
    },
    filter: function (opts, ctx, next) {
        // Validate environment
        if (opts.env === 'dev') {
            return next(new Error('dev environment can\'t be built'));
        }

        var cwd = process.cwd();
        fs.readFile(cwd + '/app/config/config_' + opts.env + '.js', function (err, contents) {
            if (err) {
                return next(new Error('Unknown environment: ' + opts.env));
            }

            // Expose the version in the opts
            var version = contents.toString().match(/["']?version['"]?\s*:\s*(\d+)/);
            if (!version) {
                return next(new Error('Could not increment version'));
            }
            opts.version = Number(version[1]) + 1;

            // Set some necessary vars to be used bellow
            opts.targetDir = cwd  + '/web/' + opts.env;
            opts.tempDir = cwd + '/tmp';
            opts.projectDir = cwd;

            ctx.log.writeln('Will build version ' + String(opts.version).green);
            next();
        });
    },
    tasks: [
        {
            task: 'rm',
            description: 'Clean up previous build',
            options: {
                files: ['{{tempDir}}', '{{targetDir}}']
            }
        },
        {
            task: 'mkdir',
            description: 'Create build folder',
            options: {
                dirs: ['{{tempDir}}', '{{targetDir}}']
            }
        },
        {
            task: 'cp',
            description: 'Copy necessary files to temporary folder',
            options: {
                files: {
                    '{{projectDir}}/app/**/*': '{{tempDir}}/app/',
                    '{{projectDir}}/src/**/*': '{{tempDir}}/src/',
                    '{{projectDir}}/vendor/**/*': '{{tempDir}}/vendor/',
                    '{{projectDir}}/*': '{{tempDir}}/'
                }
            }
        },
        {
            task: dejavuOpt,
            options: {
                files: {
                    '{{tempDir}}/src/**/*.js': '{{tempDir}}/src/',
                    '{{tempDir}}/vendor/spoon.js/src/**/*.js': '{{tempDir}}/vendor/spoon.js/src/',
                    '{{tempDir}}/vendor/events-emitter/src/**/*.js': '{{tempDir}}/vendor/events-emitter/src/',
                    '{{tempDir}}/vendor/dom-responder/src/**/*.js': '{{tempDir}}/vendor/dom-responder/src/',
                    '{{tempDir}}/vendor/base-adapter/src/**/*.js': '{{tempDir}}/vendor/base-adapter/src/',
                    '{{tempDir}}/vendor/address/src/**/*.js': '{{tempDir}}/vendor/address/src/'
                }
            },
            description: 'Optimize dejavu usages',
            on: '{{dejavu}}'
        },
        // TODO: create automaton task for this (requirejs)
        {
            task: function (opts, ctx, next) {
                rjs.optimize({
                    // Loader settings
                    mainConfigFile: opts.projectDir + '/app/bootstrap.js',   // Include the main configuration file
                    baseUrl: opts.projectDir + '/tmp/src',                   // Point to the tmp folder
                    paths: {
                        'app-config': '../app/config/config_' + opts.env     // Point the prod config
                    },
                    packages: [
                        // css
                        {
                            name: 'css',
                            location:  '../vendor/require-css',              // We use the require-css plugin because curl-css
                            main: 'css'                                      // is not compatible with r.js
                        },
                        // spoon
                        {
                            name: 'spoon',
                            location: '../vendor/spoon.js/src'
                        },
                        // dejavu
                        {
                            name: 'dejavu',
                            location: '../vendor/dejavu/dist/amd/loose'      // Point to the loose version
                        }
                    ],
                    // r.js specific settings
                    name: '../vendor/almond/almond',                         // Use almond
                    include: 'app/bootstrap',
                    out: opts.tempDir + '/app.js',
                    has: {
                        debug: false
                    },
                    optimize: 'none',
                    separateCSS: true,
                    stubModules: ['has', 'text', 'css', 'css/css', 'css/normalize']
                }, function (log) {
                    ctx.log.write(log);
                    next();
                }, function (err) {
                    next(err);
                });
            },
            description: 'Run r.js optimizer'
        },
        // TODO: create automaton task for this (requirejs)
        {
            task: function (opts, ctx, next) {
                rjs.optimize({
                    optimizeCss: 'standard.keepLines',
                    cssIn: opts.tempDir + '/app.css',
                    out: opts.tempDir + '/app.css',
                    preserveLicenseComments: opts.licenses
                }, function (log) {
                    ctx.log.write(log);

                    // Replace trailing css from loader defs
                    fs.readFile(opts.tempDir + '/app.js', function (err, contents) {
                        if (err) {
                            return next(err);
                        }

                        contents = contents.toString().replace(/css!(.*?)\.css/g, 'css!$1');
                        fs.writeFile(opts.tempDir + '/app.js', contents, next);
                    });
                }, function (err) {
                    next(err);
                });
            },
            description: 'Expand css files'
        },
        {
            task: 'mv',
            options: {
                files: {
                    '{{tempDir}}/src/**/assets/!(css|tmpl)/**/*': '{{targetDir}}/src/',
                    '{{tempDir}}/app.js': '{{targetDir}}/app.js',
                    '{{tempDir}}/app.css': '{{targetDir}}/app.css'
                }
            },
            description: 'Move assets to the build folder'
        },
        // TODO. create automaton task for cache busting or use scaffolding-replace with regexp support
        {
            task: function (opts, ctx, next) {
                var index = opts.projectDir + '/web/index_' + opts.env + '.html',
                    css = opts.targetDir + '/app.css';

                // Update index file
                fs.readFile(index, function (err, contents) {
                    if (err) {
                        return next(err);
                    }

                    contents = contents
                        .toString()
                        .replace(/(app(?:\.min)?\.(?:css|js))(?:\?\d+)?/g, function (all, match) {
                            return match + '?' + opts.version;
                        });

                    fs.writeFile(index, contents, function (err) {
                        if (err) {
                            return next(err);
                        }

                        // Update css file
                        fs.readFile(css, function (err, contents) {
                            if (err) {
                                return next(err);
                            }

                            contents = contents
                                .toString()
                                .replace(/(url\s*\(["']?)(.*?)(["']?\))/ig, function (match, start, url, end) {
                                    url = start + url.split('?', 2)[0] + '?' + opts.version + end;
                                    return url;
                                });

                            fs.writeFile(css, contents, next);
                        });
                    });
                });
            },
            description: 'Apply cache busting'
        },
        // TODO: create automaton task for this (minjs)
        {
            task: function (opts, ctx, next) {
                // TODO: minified also contains a .map with the source mappings
                //       investigate how to integrate it!
                var minified = UglifyJS.minify(opts.targetDir + '/app.js'),
                    minifiedSize = String(minified.code.length),
                    gzipSize = String(gzip.zip(minified.code, {}).length);

                ctx.log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + minifiedSize.green + ' bytes minified).');

                fs.writeFile(opts.targetDir + '/app.min.js', minified.code, next);
            },
            description: 'Minify js file'
        },
        // TODO: create automaton task for this (mincss)
        {
            task: function (opts, ctx, next) {
                fs.readFile(opts.targetDir + '/app.css', function (err, contents) {
                    if (err) {
                        return next(err);
                    }

                    var minified = cleanCSS.process(contents.toString(), opts),
                        minifiedSize = String(minified.length),
                        gzipSize = String(gzip.zip(minified, {}).length);

                    ctx.log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + minifiedSize.green + ' bytes minified).');

                    fs.writeFile(opts.targetDir + '/app.min.css', minified, next);
                });
            },
            description: 'Minify css file'
        },
        {
            task: function (opts, ctx, next) {
                var configFile = opts.projectDir + '/app/config/config_' + opts.env + '.js';
                fs.readFile(configFile, function (err, contents) {
                    if (err) {
                        return next(err);
                    }

                    // Update the version in the config
                    contents = contents.toString().replace(/(["']?version['"]?\s*:\s*)\d+/, function (all, match) {
                        return match + opts.version;
                    });

                    fs.writeFile(configFile, contents, next);
                });
            },
            description: 'Save version number'
        },
        {
            task: 'rm',
            description: 'Clean up temporary files',
            options: {
                files: '{{tempDir}}'
            }
        }
    ]
};

module.exports = task;
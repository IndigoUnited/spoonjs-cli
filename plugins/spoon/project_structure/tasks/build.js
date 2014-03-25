/*jshint node:true, es3:false, regexp:false, evil:true*/

'use strict';

var fs        = require('fs');
var rjs       = require('requirejs');
var UglifyJS  = require('uglify-js');
var cleanCSS  = require('clean-css');
var gzip      = require('gzip-js');
var mout      = require('mout');

module.exports = function (task) {
    task
    .id('build')
    .name('Build')
    .author('Indigo United')
    .description('Build project')
    .option('env', 'The environment to build', 'prod')

    .setup(function (opts, ctx, next) {
        // Validate environment
        if (opts.env === 'dev') {
            return next(new Error('dev environment can\'t be built'));
        }

        var cwd = process.cwd();

        // Expose the version in the opts
        // Convert from decimal base to base36 to decrease the size of the number
        opts.version = Date.now().toString(36);

        // Set some necessary vars to be used bellow
        opts.targetDir = cwd  + '/web/' + opts.env;
        opts.tempDir = cwd + '/tmp';
        opts.projectDir = cwd;
        opts.parameters = require(__dirname + '/../app/config/parameters.json');

        ctx.log.writeln('Will build version ' + opts.version.green);

        next();
    })

    .do('rm', {
        description: 'Clean up previous build',
        options: {
            files: ['{{tempDir}}', '{{targetDir}}']
        }
    })
    .do('mkdir', {
        description: 'Create build folder',
        options: {
            dirs: ['{{tempDir}}', '{{targetDir}}']
        }
    })
    .do('cp', {
        description: 'Copy necessary files to temporary folder',
        options: {
            files: {
                '{{projectDir}}/app/**/*': '{{tempDir}}/app/',
                '{{projectDir}}/src/**/*': '{{tempDir}}/src/',
                '{{projectDir}}/bower_components/**/*': '{{tempDir}}/bower_components/',
                '{{projectDir}}/*': '{{tempDir}}/'
            }
        }
    })
    .do(function (opts, ctx, next) {
        var loaderFile = opts.tempDir + '/app/loader.js';

        fs.readFile(loaderFile, function (err, contents) {
            var start,
                end,
                config;

            if (err) {
                return next(err);
            }

            contents = contents.toString();
            start = contents.indexOf('({');
            end = contents.indexOf('});');

            if (start === -1 || end === -1) {
                return next(new Error('Could not locate start/end of loader config'));
            }

            start += 1;
            end += 1;

            try {
                eval('config = ' + contents.slice(start, end));
            } catch (err) {
                return next(err);
            }

            // Pass config bellow
            opts.loader = {
                start: start,
                end: end,
                contents: contents,
                config: config
            };

            next();
        });
    }, {
        description: 'Read loader config'
    })
    .do(function (opts, ctx, next) {
        var loader = opts.loader,
            config = loader.config,
            configStr = loader.contents,
            pkg;

        // Change baseUrl
        config.baseUrl = mout.string.trim(opts.parameters.basePath, '/') + '/' + opts.env + '/src',

        // Change app-config path to point to the correct environment
        pkg = config.packages && mout.array.find(config.packages, function (pkg) {
            return pkg.name === 'app-config';
        });
        if (pkg) {
            pkg.main = 'config_' + opts.env;
        }

        // Replace css package location to use require-css
        // We use curl-css in dev because it works on IE9 but it's not
        // compatible with r.js builder
        pkg = config.packages && mout.array.find(config.packages, function (pkg) {
            return pkg.name === 'css';
        });
        if (pkg) {
            pkg.location = '../bower_components/require-css';
            pkg.main = 'css';
        }

        // Set cache busting
        config.urlArgs = opts.version;

        // Write back config
        configStr = configStr.slice(0, loader.start) + JSON.stringify(config, null, '    ') + configStr.substr(loader.end);
        fs.writeFile(opts.tempDir + '/app/loader.js', configStr, next);
    }, {
        description: 'Transform loader config'
    })
    // TODO: create automaton task for this (requirejs)
    .do(function (opts, ctx, next) {
        var config;

        config = mout.object.deepMixIn(opts.loader.config, {
            baseUrl: opts.tempDir + '/src',                  // Point to the tmp folder
            name: '../bower_components/requirejs/require',   // Include require.js (you can switch to almond if compatible)
            include: ['../app/loader', '../app/bootstrap'],  // Include main files
            out: opts.tempDir + '/app.js',
            has: {
                debug: false
            },
            optimize: 'none',
            separateCSS: true,
            stubModules: ['has', 'text', 'css', 'css/css', 'css/normalize']
        });

        rjs.optimize(config, function (log) {
            ctx.log.info(log);
            next();
        }, function (err) {
            next(err);
        });
    }, {
        description: 'Run r.js optimizer'
    })
    // TODO: create automaton task for this (requirejs)
    .do(function (opts, ctx, next) {
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
    }, {
        description: 'Expand css files'
    })
    .do('mv', {
        description: 'Move assets to the build folder',
        options: {
            files: {
                '{{tempDir}}/src/**/assets/!(css|tmpl)/**/*': '{{targetDir}}/src/',
                '{{tempDir}}/app.js': '{{targetDir}}/app.js',
                '{{tempDir}}/app.css': '{{targetDir}}/app.css'
            }
        }
    })
    // TODO. create automaton task for cache busting or use scaffolding-replace with regexp support
    .do(function (opts, ctx, next) {
        var index = opts.projectDir + '/web/index_' + opts.env + '.html',
            css = opts.targetDir + '/app.css';

        // Update index file
        fs.readFile(index, function (err, contents) {
            if (err) {
                return next(err);
            }

            contents = contents
                .toString()
                .replace(/(\/app(?:\.min)?\.(?:css|js))(?:\?\w+)?/g, function (all, match) {
                    return match + '?' + opts.version;
                });

            fs.writeFile(index, contents, function (err) {
                if (err) {
                    return next(err);
                }

                // Update css file
                fs.readFile(css, function (err, contents) {
                    var dataUriRegExp;

                    if (err) {
                        return next(err);
                    }

                    dataUriRegExp = /^data:/;

                    contents = contents
                        .toString()
                        .replace(/(url\s*\(["']?)(.*?)(["']?\))/ig, function (match, start, url, end) {
                            // Ignore data URIs
                            if (dataUriRegExp.test(url)) {
                                return start + url + end;
                            }

                            url = start + url.split('?', 2)[0] + '?' + opts.version + end;
                            return url;
                        });

                    fs.writeFile(css, contents, next);
                });
            });
        });
    }, {
        description: 'Apply cache busting'
    })
    // TODO: create automaton task for this (minjs)
    .do(function (opts, ctx, next) {
        // TODO: minified also contains a .map with the source mappings
        //       investigate how to integrate it!
        var minified = UglifyJS.minify(opts.targetDir + '/app.js'),
            minifiedSize = String(minified.code.length),
            gzipSize = String(gzip.zip(minified.code, {}).length);

        ctx.log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + minifiedSize.green + ' bytes minified).');

        fs.writeFile(opts.targetDir + '/app.min.js', minified.code, next);
    }, {
        description: 'Minify js file'
    })
    // TODO: create automaton task for this (mincss)
    .do(function (opts, ctx, next) {
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
    }, {
        description: 'Minify css file'
    })
    .do('rm', {
        description: 'Clean up temporary files',
        options: {
            files: [
                '{{tempDir}}',
                '{{targetDir}}/app.js',
                '{{targetDir}}/app.css'
            ]
        }
    });
};

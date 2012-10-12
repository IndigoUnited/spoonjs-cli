#!/usr/bin/env node

var Engine = require('./src/Engine'),
    spooncli;

spooncli = new Engine(process.argv);

spooncli.parse();
Spoon.js CLI
============

Engine should be flexible enough to add modules without changing the core.

The CLI will help do a lot of usual tasks in the simplest way possible. Consider
enabling auto-complition for spoonjs commands. Check
[https://github.com/mklabs/node-tabtab](https://github.com/mklabs/node-tabtab)
for a possible solution.

The CLI offers the following commands:

## Framework

* spoon update --force
  * `--force` forces updating into the latest version, regardless of it being
  backwards compatible

## Project

* spoon project create
  * all the dependencies should work without the need for external installations
    such as ruby or java
* spoon project test
* spoon project run
  * http server
  * automatically watches the source folders (useful to automatically compile
    sass files)
* spoon project deploy

## Module

* spoon module create
* spoon module test
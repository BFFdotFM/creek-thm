#!/usr/bin/env node

/*

A simple CLI for the Creek Themes API.

*/

var fs = require('fs-extra');
var os = require('os');
var path = require('path');
var watch = require('watch');
var request = require('request');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var chalk = require('chalk');
var git = require("git-rev-sync");

//Include modules from ./lib
var install = require('./lib/install');
var uninstall = require('./lib/uninstall');
var c = require('./lib/common');

//Get settings from ~/.creek-themes/settings.json
var user_theme_settings = require('./lib/user-settings');

//Random CLI methods
var cli_methods = require('./lib/cli-methods');


//Install theme tools
program
.command('install')
.action(function(status_type) {
  install.command();
  cli_methods.status(status_type);
});

//Uninstall theme tools
program
  .command('uninstall')
  .action(function(status_type) {
    uninstall.command();
    cli_methods.status(status_type);
  });

//Download theme (and unzip the zip)
program
  .command('download [theme_address]')
  .action(function(theme_address) {
    if(install.check()){
      cli_methods.download(theme_address, false);
    }
  });

//Download a zip file of the theme (or rather, don't unzip)
program
  .command('download-zip [theme_address]')
  .action(function(theme_address) {
    if(install.check()){
      cli_methods.download(theme_address, true);
    }
  });

//List themes for domain
program
  .command('list [domain]')
  .action(function(theme_address) {
    if(install.check()){
      cli_methods.list(theme_address);
    }
  });

//API keys: Add for domain
program
  .command('add-key [domain] [key]')
  .action(function(domain, key) {
    if(install.check()){
      cli_methods.addKey(domain, key);
    }
  });

//API keys: Get all keys
program
  .command('get-keys')
  .action(function() {
    if(install.check()){
      cli_methods.getKeys();
    }
  });

//API keys: Get for domain
program
  .command('get-key [domain]')
  .action(function(domain) {
    if(install.check()){
      cli_methods.getKey(domain);
    }
  });

//API key: Delete for domain
program
  .command('delete-key [domain]')
  .action(function(domain) {
    if(install.check()){
      cli_methods.deleteKey(domain);
    }
  });

//Theme: change status
program
  // Status types: editing | public | public_managers | public_hosts
  .command('status [status_type]')
  .action(function(status_type) {
    if(install.check()){
      cli_methods.status(status_type);
    }
  });

//Theme: Sync up/down
program
  .command('sync [direction]') // up | down
  .action(function(direction) {
    if(!direction){
      console.log(chalk.bold.red("Error:")+" You must specify a sync direction: "+chalk.bold.blue("up")+" (sync local to remote) or "+chalk.bold.blue("down")+" (sync remote to local)")
      return;
    }
    if(install.check()){
      cli_methods.sync(direction);
    }
  });

//TODO:
//Create a theme folder with theme.json inside
program
  .command('create')
  .action(function(status_type, theme_title) {
    if(install.check()){
      cli_methods.createTheme(status_type);
    }
  });

//Push file
program
  .command('push [file_path]')
  .action(function(file_path) {
    if(install.check()){
      cli_methods.pushFile(file_path);
    }
  });

//Pull file
program
  .command('pull [file_path]')
  .action(function(file_path) {
    if(install.check()){
      cli_methods.pullFile(file_path);
    }
  });

//Test git branch
program
  .command('test-git')
  .action(function() {
    try {

      console.log(chalk.bold.green("Git:")+" Testing git branch:")
      console.log(git.branch(process.cwd()))
      console.log(chalk.bold.green("Git:")+" Testing git commit ID:")
      console.log(git.short(process.cwd()))
      console.log(chalk.bold.green("Git:")+" Testing git commit message:")
      console.log(git.message(process.cwd()))

    } catch (e) {

      console.log(e);

    }
  });

// //TODO:
// //Push all files to remote theme. Same as sync up.
// program
//   .command('push')
//   .action(function() {
//     if(install.check()){
//       cli_methods.pushTheme();
//     }
//   });
//
// //TODO:
// //Pull all files from remote theme. Same as sync down.
// program
//   .command('pull')
//   .action(function() {
//     if(install.check()){
//       cli_methods.pullTheme();
//     }
//   });

//Command prompt: watch the folder for changes
program
  .command('watch')
  .action(function() {

    if(install.check()){

      //Only include the file monitor, now that we're in a theme folder.
      var monitor = require('./lib/monitor');

      monitor.startMonitor();

      return;

    }

  });

program.parse(process.argv);

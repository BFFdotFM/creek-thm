#!/usr/bin/env node

/*

A simple CLI for the Creek Themes API

------------------------------------------

creek-themes install
creek-themes uninstall
creek-themes watch

------------------------------------------

FUTURE EXAMPLE USAGE NOT YET BUILT:

Get theme files as a new dir (like git clone)
(Creates local copy if it doesn't exist.)

> creek-themes pull cool-theme1@example.creek.fm

- Gets a zip file of the theme, and unzips it into the current directory.

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

//Include modules from ./lib
var install = require('./lib/install');
var uninstall = require('./lib/uninstall');

//Get settings from ~/.creek-themes/settings.json
var user_theme_settings = require('./lib/user-settings');

program
  .arguments('<file>')
  .option('-t, --theme theme-name@example.com', 'A remote theme to pull and start editing.')
  .action(function(command) {

    //Check if it's been installed already
    if (command !== "install" && command !== "uninstall" && !fs.existsSync(user_theme_settings.getSettingsDir())){
      console.log(chalk.bold.blue('INSTALL NEEDED: ')+"Creek theme tools have not yet been installed.");
      console.log(chalk.bold.black('INSTRUCTIONS: ')+"To install, run: creek-themes install");
      return;
    }

    if(command == "install" && !fs.existsSync(user_theme_settings.getSettingsDir())){

      co(function *() {

        console.log(" ");
        console.log(chalk.bold.cyan('---------- Installation ----------'));
        console.log(" ");
        console.log(chalk.bold.blue('First, we need an API key.'));
        console.log("1. Sign in to the Creek Control Panel that's hosting the theme.");
        console.log("2. Go to your user profile. Click your name in the top toolbar, then click Profile.");
        console.log("3. Find your API key on this page, copy it, and paste it below.");
        var api_key = yield prompt(chalk.bold.black('Enter API key: '));

        console.log(" ");
        console.log(chalk.bold.blue('Second, we need a domain. '));
        console.log("What is the domain of this Creek website? (example: website-name.creek.fm)");
        var domain = yield prompt(chalk.bold.black('Enter domain: '));

        var install_results = install.settings(domain, api_key);

        // console.log(install_results.success);
        console.log(" ");

        console.log(chalk.bold.green('INSTALLED: ')+"Created settings directory: "+user_theme_settings.getSettingsDir());
        console.log(chalk.bold.green('SETTINGS ADDED: ')+"Created settings.json that contains your API keys: "+user_theme_settings.getSettingsFilePath());

        // return;

      });

      return;

    }

    //If already installed
    if(command == "install" && fs.existsSync(user_theme_settings.getSettingsDir())){
      console.log(chalk.bold.red('INSTALL ERROR: ')+"Directory already exists: "+install.getSettingsDir());
      console.log("Install will not overwrite this directory. Please check the settings.json file inside that directory to make sure you want to delete it. If so, then run: creek-themes uninstall");
      return;
    }

    if(command == "uninstall" && fs.existsSync(user_theme_settings.getSettingsDir())){
      console.log(chalk.bold.green('UNINSTALLED: ')+"Settings directory removed: "+install.getSettingsDir());
      uninstall.settings();
      return;
    }

    if(command == "uninstall" && !fs.existsSync(user_theme_settings.getSettingsDir())){
      console.log(chalk.bold.red('ERROR: ')+"Can't uninstall, since it's not installed yet. Settings directory does not yet exist: "+install.getSettingsDir());
      return;
    }

    //Finally, all the way down here, the monitoring thing:
    if(command == "watch"){

      //Only include the file monitor, now that we're in a theme folder.
      var monitor = require('./lib/monitor');

      monitor.startMonitor();

      return;

    }

  })
  .parse(process.argv);

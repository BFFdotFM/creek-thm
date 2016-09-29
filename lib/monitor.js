/*

Creek Theme File Watcher

Watches a folder and uploads changed files.

*/
var fs = require('fs');
var path = require('path');
var watch = require('watch');
var request = require('request');
var chalk = require('chalk');

// var settings = require('./settings').get();
var c = require('./common');

var config = require("./config").config;
var fileMethods = require("./file-methods").main;

//-----------------------------------------------

// Start the watching process:

module.exports.startMonitor = function(){

  var mainFileMonitor = {};

  watch.createMonitor(config.watch.path, function (monitor) {

    console.log(" ");
    c.log(chalk.bold.blue("File monitor is active."));
    c.log(chalk.bold.black("Monitoring: ")+config.watch.path);
    c.log(chalk.bold.black("Current theme: ")+config.theme.id+"@"+config.theme.domain, 1);
    console.log(" ");

    monitor.files[path.join(config.watch.path, "theme.json")];

    monitor.on("created", function (file_path, stat) {

      c.debug("Created: "+file_path, 2);
      fileMethods.created(file_path);

    })
    monitor.on("changed", function (file_path, curr, prev) {

      c.debug("Changed: "+file_path, 2);
      fileMethods.changed(file_path);

    })
    monitor.on("removed", function (file_path, stat) {

      c.debug("Removed: "+file_path, 2);
      fileMethods.removed(file_path);

    })

    var mainFileMonitor = monitor;

  })

}

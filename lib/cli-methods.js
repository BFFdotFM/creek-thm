var fs = require('fs-extra');
var os = require('os');
var path = require('path');
var watch = require('watch');
var request = require('request');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var chalk = require('chalk');
var unzip = require('unzip');

var c = require('./common');

var handleSyncResponse = require("./http-methods").handleSyncResponse;

//Get settings from ~/.creek-themes/settings.json
var user_theme_settings = require('./user-settings').get();

// console.log(user_theme_settings);

//Download theme
module.exports.download = function(theme_address){

  c.log(chalk.bold.blue('Getting theme: ')+theme_address);

  var theme_id = theme_address.split("@")[0];
  var domain = theme_address.split("@")[1];

  var api_key = user_theme_settings.api_keys[domain] || null;

  if(!api_key){
    console.log(chalk.bold.red('ERROR: ')+"No API key for this domain.");
    return;
  }

  var url = "http://"+domain+"/api/v2/themes/"+theme_id+"/theme/download?key="+api_key;

  var theme_path = path.join(process.cwd(), theme_id);

  if(c.directoryExists(theme_path)){
    console.log(chalk.bold.red('ERROR: ')+"Theme already downloaded.");
    return;
  }

  // console.log(formData);

  request
    .get(url)
    .on("response", function(httpResponse){

      if(httpResponse.statusCode !== 200){
        console.log(chalk.red.bold("ERROR: "+"Could not download theme."));
        return;
      }

      // httpResponse.pipe(unzip.Extract({ path: theme_path }));
      // console.log(body)

      //These just make sure that the CLI process terminates properly
      httpResponse.on("data", function(data){
        // console.log(1)
        // console.log(data)
      })
      httpResponse.on("end", function() {
        // console.log("done");
        console.log(chalk.green.bold("Downloaded: ")+theme_address);
        // console.log(chalk.green.bold("Downloaded: ")+"Theme location: "+theme_path);
      });

      // return handleSyncResponse(err, body, theme_path, "Downloaded");

      // return;

    })
    .on("complete", function(){
      console.log(chalk.black.bold("Location: ")+theme_path);
    })
    .pipe(unzip.Extract({ path: theme_path }));

}


//Download theme
module.exports.list = function(domain){

  c.log(chalk.bold.blue('Getting themes at: ')+domain);

  var api_key = user_theme_settings.api_keys[domain] || null;

  if(!api_key){
    console.log(chalk.bold.red('ERROR: ')+"No API key for this domain.");
    return;
  }

  var url = "http://"+domain+"/api/v2/themes?key="+api_key;

  request(url, function(err, httpResponse, body){

    if(err){
      console.log(chalk.red.bold("ERROR: "+"Could not get list of themes."));
      return;
    }

    var list = c.getJSONfromResponse(body);

    if(list.success){
      console.log(chalk.green.bold("List of themes: "));
      for (var i = 0; i < list.data.data.length; i++) {
        console.log(list.data.data[i].id+"|"+list.data.data[i].title)
      }
    }

  });

}


//Update theme status
module.exports.status = function(status_type){

  var config = require("./config").config;
  var config_methods = require("./config").config_methods;

  var api_key = user_theme_settings.api_keys[config.theme.domain] || null;

  if(!api_key){
    console.log(chalk.bold.red('ERROR: ')+"No API key for this domain.");
    return;
  }

  var url = "http://"+config.theme.domain+"/api/v2/themes/"+config.theme.id+"/theme/"+status_type+"?key="+api_key;

  // console.log(formData);

  request(url, function(err, httpResponse, body){

    var json = c.getJSONfromResponse(body);

    if(err || !json.success){
      console.log(chalk.red.bold("ERROR: ")+"Could not get list of themes.");
      return;
    }

    console.log(chalk.green.bold("Status updated: ")+json.data.message);

  });

}

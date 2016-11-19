var fs = require('fs-extra');
var os = require('os');
var path = require('path');
var watch = require('watch');
var request = require('request');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var chalk = require('chalk');
var unzip = require('unzip2');
var recursive = require('recursive-readdir');

var c = require('./common');

var handleSyncResponse = require("./http-methods").handleSyncResponse;
var fileMethods = require("./file-methods").main;
var gitBranch = require("./git-branch");

//Get settings from ~/.creek-themes/settings.json
var user_theme_settings = require('./user-settings').get();
var user_theme_settings_methods = require('./user-settings');


// console.log(user_theme_settings);
module.exports.getKeys = function(){

  //Open the user's settings file
  console.log(user_theme_settings.api_keys);

}

// console.log(user_theme_settings);
module.exports.getKey = function(domain){

  //Open the user's settings file
  console.log(user_theme_settings.api_keys[domain]);

}


module.exports.addKey = function(domain, key){

  //Add the key to settings var
  user_theme_settings.api_keys[domain] = key;

  var fp = user_theme_settings_methods.getSettingsFilePath();

  //get JSON
  var json = JSON.stringify(user_theme_settings);

  // console.log(

  //Write the file again
  fs.writeFile(fp, json, {flag:'w'}, function(err) {
    if (err) throw err;
    // callback();
  });

}

// console.log(user_theme_settings);
module.exports.deleteKey = function(domain){

  //Remove the key from settings var
  delete user_theme_settings.api_keys[domain];

  var fp = user_theme_settings_methods.getSettingsFilePath();

  //get JSON
  var json = JSON.stringify(user_theme_settings);

  //Write the file again
  fs.writeFile(fp, json, {flag:'w'}, function(err) {
    if (err) throw err;
  });

}

//Download theme
module.exports.download = function(theme_address, zip_only){

  //Only download the zip, don't extract?
  zip_only = zip_only || false;

  c.log(chalk.bold.blue('Getting the theme: ')+theme_address);

  var theme_id = theme_address.split("@")[0];
  var domain = theme_address.split("@")[1];

  var api_key = user_theme_settings.api_keys[domain] || null;

  if(!api_key){
    console.log(chalk.bold.red('ERROR: ')+"No API key for this domain.");
    return;
  }

  var url = "http://"+domain+"/api/v2/themes/"+theme_id+"/theme/download?key="+api_key;

  var theme_path = path.join(process.cwd(), theme_id);
  var theme_path_zip = theme_path + ".zip";

  if(c.directoryExists(theme_path)){
    console.log(chalk.bold.red('ERROR: ')+"Theme directory already exists: "+theme_path);
    return;
  }
  if(c.fileExists(theme_path_zip)){
    console.log(chalk.bold.red('ERROR: ')+"Theme zip file already exists: "+theme_path_zip);
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
        // console.log(chalk.green.bold("Downloaded: ")+theme_address);
      });

      // return handleSyncResponse(err, body, theme_path, "Downloaded");

      // return;

    })
    .on("complete", function(){

      //Don't Unzip
      if(zip_only){
        console.log(chalk.green.bold("Downloaded to: ")+theme_path_zip);
      }
      //Unzip
      else{
        fs.createReadStream(theme_path_zip)
          .pipe(unzip.Extract({ path: theme_path }))
          .on("finish", function(){
            console.log(chalk.black.bold("Downloaded and unzipped to: ")+theme_path);
            fs.unlink(theme_path_zip);
            return;
          })
          .on("error", function(error){
            console.log(chalk.red.bold("ERROR: ")+error);
          })
      }

    })
    .pipe(fs.createWriteStream(theme_path_zip));

}


//List all themes
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

  var git_branch = gitBranch();

  var api_key = user_theme_settings.api_keys[config.theme.domain] || null;

  if(!api_key){
    console.log(chalk.bold.red('ERROR: ')+"No API key for this domain.");
    return;
  }

  var url = "http://"+config.theme.domain+"/api/v2/"
    + "themes/"
    + config.theme.id
    + "/theme/"
    + status_type
    + "?key="+api_key

  //Add git branch and theme data to form data
  var formData = {
    git_branch: git_branch,
    theme: config.theme
  }

  c.debug(url, 2);

  request.post({
    url: url,
    form: formData
    // formData: formData
  }, function(err, httpResponse, body){

    var json = c.getJSONfromResponse(body);

    c.debug("RESPONSE:");
    c.debug(json, 2);

    if(err || !json.success){
      console.log(chalk.red.bold("ERROR: ")+"Could not update theme status.");
      return;
    }

    console.log(chalk.green.bold("Status updated: ")+json.data.message);

  });

}

//Update theme status
module.exports.sync = function(direction){

  /*

  UP:
  - Just run watch handlers on all file paths.

  DOWN:
  - Download the zip file
  - extract
  - merge in the changed files
  - keep track of the replaced files

  */

  if(direction=="up"){

    function ignoreFunc(file, stats) {
      // `file` is the absolute path to the file, and `stats` is an `fs.Stats`
      // object returned from `fs.lstat()`.
      return stats.isDirectory() && path.basename(file) == "test";
    }

    //Push all files in the theme directory
    recursive(

      //Use the current working directory
      process.cwd(),

      //Ignore .git* files by default
      [".git*", "theme.json", ignoreFunc],

      function (err, files){

        for (var f = 0; f < files.length; f++) {
          module.exports.pushFile(files[f]);
        }

      });

  }
  else if(direction=="down"){

    //Not built

  }


}

module.exports.pullTheme = function(){

  //GET the theme settings for the theme ID that's in the current theme.json

  //do sync down

}

module.exports.pushTheme = function(){

  //POST the theme settings for the theme.json in this directory

  //do sync up (iterate over all changed files)

}

module.exports.createTheme = function(id_string, theme_title){

  //Parse name@domain.com

  //Create the folder with name

  //Create a theme.json file with: name, domain, theme_title

  //POST the theme settings

}


module.exports.pullFile = function(file_path){

  fileMethods.changed(file_path);

}

module.exports.pushFile = function(file_path){

  fileMethods.changed(file_path);

}

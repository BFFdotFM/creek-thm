var fs = require('fs-extra');
var os = require('os');
var path = require('path');
var chalk = require('chalk');
var replace = require("replace");

var user_theme_settings = require("./user-settings.js");


module.exports.settings = function(domain, api_key){

  var settings_dir = user_theme_settings.getSettingsDir();

  //Create settings dir in user's home directory
  if (!fs.existsSync(settings_dir)){

    fs.mkdirSync(settings_dir);

    var settings_file_path = user_theme_settings.getSettingsFilePath();
    var ignore_file_path = user_theme_settings.getIgnoreFilePath();

    //Copy example settings file to user's settings dir
    fs.copySync(
      path.join(__dirname, '..', 'settings.default.json'),
      settings_file_path
    );
    //Copy default .watchignore file
    fs.copySync(
      path.join(__dirname, '..', '.watchignore'),
      ignore_file_path
    );

    replace({
        regex: "API_KEY_GOES_HERE",
        replacement: api_key,
        paths: [settings_file_path],
        recursive: true,
        silent: true,
    });
    replace({
        regex: "website-name.creek.fm",
        replacement: domain,
        paths: [settings_file_path],
        recursive: true,
        silent: true,
    });

    return {success: true, error: null};

  }
  //Or do nothing if already installed
  else{

    return {success: false, error: "Already installed."};

  }


}

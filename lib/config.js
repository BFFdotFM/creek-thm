var fs = require("fs-extra");
var path = require("path");
var chalk = require("chalk");

var c = require("./common");

//Get settings from ~/.creek-themes/settings.json
var user_theme_settings = require('./user-settings').get();

module.exports.config_methods = {
  getIgnoreList: function(){
    //Create array from ignore list
    var list = [];
    var fs = require('fs');
    var p = path.join('.', '.watchignore');
    if(c.fileExists(p)){
      var array = fs.readFileSync(p).toString().split("\n");
      for(i in array) {
        list.push(i);
      }
    }
    return list;
  },
  getThemeSettings: function(){

    // console.log(watch_path);
    // console.log(path.join(config.watch.path, 'theme.json');

    try {
      var json_file = fs.readFileSync(path.join(process.cwd(), 'theme.json'));
    } catch (e) {
      console.log(chalk.bold.red("ERROR: ")+"No theme.json file in this directory. Make sure that you 'cd' to the theme directory before running theme commands.")
    }

    try {
      var data = JSON.parse(json_file);
    } catch (e) {
      console.log(chalk.bold.red("ERROR: ")+"Could not parse theme.json. There is a syntax error or problem with the JSON file.");
    }

    return data;

  },
  getApiKeyForTheme: function(domain){
    return user_theme_settings.api_keys[module.exports.config.theme.domain];
  }
}

module.exports.config = {
  creek: {
    themeObjectTypes: ['files', 'blocks', 'templates', 'pages']
  },
  watch: {
    // path: settings.theme.default_path,
    path: process.cwd(),
    ignoreList: module.exports.config_methods.getIgnoreList(),
  },
  theme: {}
}

//Set the theme settings data outside, since path above is used in the getThemeSettings function
module.exports.config.theme = module.exports.config_methods.getThemeSettings(module.exports.config.watch.path);

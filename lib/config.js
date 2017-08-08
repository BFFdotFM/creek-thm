var fs = require("fs-extra");
var path = require("path");
var chalk = require("chalk");
var findParentDir = require('find-parent-dir');

var c = require("./common");

//Get settings from ~/.creek-themes/settings.json
var user_theme_settings = require('./user-settings').get();

// //Always ignore some default paths
// var defaultIgnorePaths = [
//   '.git',
//   '/.git',
//   '.DS_Store',
//   '.gitignore',
//   'readme.md'

//   // '/.', // IDEA: Ignore all dotfiles?
//   // '/.', // IDEA: Ignore everything but certain files?
// ];

//Always ignore some default paths
var defaultWhitelistPathFragments = [
  '/blocks/',
  '/templates/',
  '/files/',
  '/theme.json',
  '/options.yml',
  '/options.yaml',
  '/theme.yml',
  '/theme.yaml',
];

module.exports.config_methods = {};

module.exports.config_methods.getWhitelist = function(){

  //There are only explicitly defined whitelist files.

  return defaultWhitelistPathFragments;

}


module.exports.config_methods.getThemeSettings = function(options){

  options = options || {}

  //Convert the theme.options data to JSON
  // Used when POSTing theme info to Themes API, otherwise MySQL
  // will fail when PHP tries to put an "Array" into those columns.
  optionsConvertToJSON = options.optionsConvertToJSON || false;

  var baseDir = options.baseDir || null;

  var fileEdited = options.fileEdited || null;

  //Set up the baseDir from file path if provided
  if(fileEdited && !baseDir){
    baseDir = path.dirname(fileEdited);
  }

  // console.log(watch_path);
  // console.log(path.join(config.watch.path, 'theme.json');
  // console.log(path.join(config.watch.path, 'theme.json');

  try {
    //Use baseDir if provided
    if(baseDir){
      var json_file = fs.readFileSync(path.join(findParentDir.sync(baseDir, 'theme.json'), "theme.json"));
    }
    //Else use the current working directory
    else{
      var json_file = fs.readFileSync(path.join(findParentDir.sync(process.cwd(), 'theme.json'), 'theme.json'));
    }
  } catch (e) {
    console.log("fileEdited: "+fileEdited);
    console.log("baseDir: "+baseDir);
    console.log("json_file: "+json_file);
    console.log(chalk.bold.red("ERROR: ")+"Error accessing the theme.json file for this directory. Make sure that you 'cd' to the theme directory before running theme commands.")
    console.log(chalk.bold.red("ERROR: ")+e)
    return null;
  }

  try {
    var data = JSON.parse(json_file);
  } catch (e) {
    console.log(chalk.bold.red("ERROR: ")+"Could not parse theme.json. There is a syntax error or problem with the JSON file.");
  }

  if(optionsConvertToJSON){
    data.options = JSON.stringify(data.options);
    data.options_edited = JSON.stringify(data.options_edited);
  }

  return data;

}

module.exports.config_methods.getApiKeyForTheme = function(file_path){
  var domain = module.exports.config_methods.getThemeSettings({fileEdited: file_path}).domain;
  return user_theme_settings.api_keys[domain];
}

module.exports.config = {
  creek: {
    themeObjectTypes: ['files', 'blocks', 'templates', 'pages']
  },
  watch: {
    // path: settings.theme.default_path,
    path: process.cwd(),
    whitelist: module.exports.config_methods.getWhitelist(),
  },
  theme: {}
}

// console.log(findParentDir.sync(process.cwd(), 'theme.json') )

//Auto-load theme settings only if we are in a theme directory with theme.json
if(findParentDir.sync(process.cwd(), 'theme.json') && c.fileExists(path.join(findParentDir.sync(process.cwd(), 'theme.json'), "theme.json"))){
// if(c.fileExists(path.join(process.cwd(), 'theme.json'))){

  //Set the theme settings data outside, since path above is used in the getThemeSettings function
  module.exports.config.theme = module.exports.config_methods.getThemeSettings();

}
else{

  // console.log(chalk.bold.red("ERROR: ")+"Error accessing the theme.json file("+path.join(process.cwd(), 'theme.json')+"). Make sure that this folder, or a parent folder, has a theme.json file before running \"thm\" commands.")

  module.exports.config.theme = undefined;

}

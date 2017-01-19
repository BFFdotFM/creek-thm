var fs = require('fs-extra');
var os = require('os');
var co = require('co');
var prompt = require('co-prompt');
var path = require('path');
var chalk = require('chalk');
var replace = require("replace");

var user_theme_settings = require("./user-settings");
var uninstall = require("./uninstall");


module.exports.check = function(){

  //Check if creek-themes has been installed already
  if(
    !fs.existsSync(user_theme_settings.getSettingsDir())
  ){
    console.log(chalk.bold.blue('INSTALL NEEDED: ')+"Creek theme tools have not yet been installed.");
    console.log(chalk.bold.black('INSTRUCTIONS: ')+"To install, run: thm install");
    return false;
  }
  else{
    return true;
  }

}

module.exports.command = function(command){

  if(!fs.existsSync(user_theme_settings.getSettingsDir())){

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

      var install_results = module.exports.settings(domain, api_key);

      // console.log(install_results.success);
      console.log(" ");

      console.log(chalk.bold.green('INSTALLED: ')+"Created settings directory: "+user_theme_settings.getSettingsDir());
      console.log(chalk.bold.green('SETTINGS ADDED: ')+"Created settings.json that contains your API keys: "+user_theme_settings.getSettingsFilePath());

      // return;

      process.exit();

    });

    return;

  }

  //If already installed
  if(fs.existsSync(user_theme_settings.getSettingsDir())){
    console.log(chalk.bold.red('INSTALL ERROR: ')+"Directory already exists: "+user_theme_settings.getSettingsDir());
    console.log("Install will not overwrite this directory. Please check the settings.json file inside that directory to make sure you want to delete it. If so, then run: thm uninstall");
    return;
  }

}

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

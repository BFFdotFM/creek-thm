var fs = require('fs-extra');
var os = require('os');
var path = require('path');
var chalk = require('chalk');

var settings_dir = path.join(os.homedir(), '.creek-themes');

module.exports.command = function(){

  if(fs.existsSync(user_theme_settings.getSettingsDir())){
    console.log(chalk.bold.green('UNINSTALLED: ')+"Settings directory removed: "+user_theme_settings.getSettingsDir());
    module.exports.settings();
    return;
  }

  if(!fs.existsSync(user_theme_settings.getSettingsDir())){
    console.log(chalk.bold.red('ERROR: ')+"Can't uninstall, since it's not installed yet. Settings directory does not yet exist: "+user_theme_settings.getSettingsDir());
    return;
  }


}

module.exports.settings = function(){

  //Remove settings folder in user's home directory
  if (fs.existsSync(settings_dir)){
    fs.removeSync(settings_dir);
  }

}

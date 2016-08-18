/*

Global settings:

Parses the settings from the settings.json file.

*/
var fs = require('fs'),
  path = require('path');
  os = require('os');


module.exports.getSettingsDir = function(){
  return path.join(os.homedir(), '.creek-themes');
}

module.exports.getSettingsFilePath = function(){
  return path.join(module.exports.getSettingsDir(), 'settings.json');
}

module.exports.getIgnoreFilePath = function(){
  return path.join(module.exports.getSettingsDir(), '.watchignore');
}

module.exports.get = function(){

  //Use user's settings
  if (fs.existsSync(module.exports.getSettingsFilePath())) {
    var json = fs.readFileSync(module.exports.getSettingsFilePath());
    return JSON.parse(json);
  }
  //Otherwise, use the default settings file
  else{
    var json = fs.readFileSync(path.join(__dirname, '..', 'settings.default.json'));
    return JSON.parse(json);
  }

}

/*
exports.update = function() {
  return {}
}
*/

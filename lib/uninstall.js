var fs = require('fs-extra');
var os = require('os');
var path = require('path');

var settings_dir = path.join(os.homedir(), '.creek-themes');

module.exports.settings = function(){

  //Remove settings folder in user's home directory
  if (fs.existsSync(settings_dir)){
    fs.removeSync(settings_dir);
  }

}

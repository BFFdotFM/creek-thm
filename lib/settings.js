/*

Global settings:

Parses the settings from the settings.json file.

*/
var fs = require('fs'),
  path = require('path');

exports.get = function(){
  var json_path = path.join(__dirname, '..', 'settings.json');
  var json = fs.readFileSync(json_path);
  return JSON.parse(json);
}

/*
exports.update = function() {
  return {}
}
*/

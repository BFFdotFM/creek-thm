/*

Creek Theme File Watcher

Watches a folder and uploads changed files.

*/
var fs = require('fs');
var path = require('path');
var watch = require('watch');
var request = require('request');

var settings = require('./lib/settings').get();
var c = require('./lib/common');

var ds = path.sep;
var protocol = "http://";

var config_methods = {
  getIgnoreList: function(){
    //Create array from ignore list
    var list = [];
    var fs = require('fs');
    var array = fs.readFileSync('.'+ds+'.watchignore').toString().split("\n");
    for(i in array) {
      list.push(i);
    }
    return list;
  },
  getThemeSettings: function(){
    var data = JSON.parse(fs.readFileSync(config.watch.path+ds+'theme.json'));
    return data;
  }
}

var config = {
  creek: {
    themeObjectTypes: ['files', 'blocks', 'templates', 'pages']
  },
  watch: {
    path: settings.theme.default_path,
    // path: process.cwd(),
    ignoreList: config_methods.getIgnoreList,
  },
  theme: {}
}

//Set the theme settings data
config.theme = config_methods.getThemeSettings();

var methods = {
  checkIgnoreThisPath: function(file_path){
    var ignore = false;
    //Check each ignore list item against the path provided:
    for (var i = 0; i < config.watch.ignoreList.length; i++) {
      if(file_path.indexOf(config.watch.ignoreList[i]) !== -1){
        ignore = true;
      }
    }
    return ignore;
  },
  getTypeFromPath: function(file_path){
    var types = config.creek.themeObjectTypes;
    var type = null;
    //Check path for each type
    for (var t = 0; t < types.length; t++) {
      if(file_path.indexOf(ds+types[t]+ds) !== -1){
        type = types[t];
      }
    }
    //Special case for theme.json
    if(file_path.indexOf(ds+"theme.json") !== -1){
      type = "theme";
    }
    return type;
  },
  prepareFormData: function(type, file_path){

    var filename = path.basename(file_path)
    var meta = null;
    var content = null;

    if(type=="pages"){

      //Get meta from page-name.json
      var filename_minus_ext = path.basename(file_path, ".html");
      var the_path = path.dirname(file_path);
      var meta = JSON.parse(fs.readFileSync(the_path+ds+filename_minus_ext+'.json'));

      content = fs.readFileSync(file_path);

    }
    else if(type=="blocks"){
      // meta =
      // content =
    }
    else if(type=="templates"){
      // meta =
      content = fs.readFileSync(file_path, "utf8");
    }
    else if(type=="theme"){
      // meta =
      // content =
    }

    return {
      meta: meta,
      content: content
    };

  },
  getUrl: function(type, file_path){
    var name = path.basename(file_path, ".html");
    return protocol + config.theme.domain
           + "/api/v2/themes/" + config.theme.id
           + ds + type + ds + name;
  }
}

methods.file = {
  changed: function(file_path){

    if(methods.checkIgnoreThisPath(file_path)){
      return false;
    }

    //If it's theme.json, then update the internal theme config
    if(file_path.indexOf(ds+"theme.json")){
      config_methods.getThemeSettings();
    }

    var type = methods.getTypeFromPath(file_path);
    var url = methods.getUrl(type, file_path);
    var formData = methods.prepareFormData(type, file_path);

    c.debug(url, 2);
    c.debug(formData, 2);

    request.put({
      url: url,
      form: formData
    }, function(err, httpResponse, body){
      if(err){
        return false;
      }
      // c.debug(err);
      // c.debug(httpResponse);
      c.debug(body);
      c.debug("Saved: "+file_path, 1);
      return true;
    })

  },
  removed: function(file_path){

    if(methods.checkIgnoreThisPath(file_path)){
      return false;
    }

    //If it's the theme.json file, then do nothing.
    if(f.indexOf(ds+"theme.json")){
      return false;
    }

    var type = methods.getTypeFromPath(file_path);
    var url = methods.getUrl(type, file_path);

    request.delete(url, function(err, res, body){
      return true;
    });

  },
  created: function(file_path){

    if(methods.checkIgnoreThisPath(file_path)){
      return false;
    }

    var type = methods.getTypeFromPath(file_path);
    var formData = methods.prepareFormData(type, file_path);

    var url = methods.getUrl(type, file_path);

    request.post({
      url: url,
      form: formData
    }, function(err, httpResponse, body){
      if(err){
        return false;
      }
      return true;
      c.debug("Saved.", 1);
    })

  }
};


//-----------------------------------------------

// Start the watching process:

var main_file_monitor = {};

watch.createMonitor(config.watch.path, function (monitor) {

  c.debug("File monitor is active.");
  c.debug("Current theme: "+config.theme.id+"@"+config.theme.domain, 1);

  monitor.files[config.watch.path+ds+"theme.json"];

  monitor.on("created", function (file_path, stat) {

    c.debug("Created: "+file_path, 2);

    methods.file.created(file_path);

  })
  monitor.on("changed", function (file_path, curr, prev) {

    c.debug("Changed: "+file_path, 2);
    methods.file.changed(file_path);

  })
  monitor.on("removed", function (file_path, stat) {

    c.debug("Removed: "+file_path, 2);
    methods.file.deleted(file_path);

  })

  var main_file_monitor = monitor;

  // monitor.stop(); // Stop watching
})

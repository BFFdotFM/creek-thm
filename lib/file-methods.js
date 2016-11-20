var path = require("path");
var fs = require("fs");
var request = require("request");
var chalk = require("chalk");
var gitBranch = require("./git-branch");

var c = require('./common');

var config = require("./config").config;
var config_methods = require("./config").config_methods;

var handleSyncResponse = require("./http-methods").handleSyncResponse;

var protocol = "http://";
var ds = path.sep;

var pug = require("pug");

// The themes in Creek still use jade, and pug is
// like jade 2.0 with some incompatible features.
// But still phasing out. It must be done.
// var jade = require("jade");

var stylus = require("stylus");
var coffeescript = require("coffee-script");

var contentTypes = [
  "html",
  "css",
  "js"
];

var contentAltTypes = {
  jade: "html",
  stylus: "css",
  coffee: "js"
};

//File markup conversions
module.exports.convert = {
  pug: function(alt_text){
    var html = pug.render(alt_text, {pretty: true});
    // c.log(html);
    return html;
  },
  jade: function(alt_text){
    var html = pug.render(alt_text, {pretty: true});
    // c.log(html);
    return html;
  },
  styl: function(alt_text){
    var css = stylus(alt_text, { pretty: true }).render();
    // c.log(css);
    return css;
  },
  coffee: function(alt_text){
    var js = coffee.compile(alt_text);
    // c.log(js);
    return js;
  }
}

//Shared utilities
module.exports.util = {
  isInArray: function(value, array) {
    return array.indexOf(value) > -1;
  },
  checkIgnoreThisPath: function(file_path){

    var ignore = false;

    if(file_path.indexOf("DS_Store") !== -1){
      return true;
    }

    //Check each ignore list item against the path provided:
    for (var i = 0; i < config.watch.ignoreList.length; i++) {
      c.debug(config.watch.ignoreList[i], 3);
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
  getContentExt: function(meta){

    var alt_type = c.val(meta, "alt_type");

    var content_ext = "";

    if(alt_type)

    if(alt_type){
      content_ext = "."+alt_type;
    }

    return content_ext;

  },
  getContentFromAlt: function(meta){

    var alt_type = c.val(meta, "alt_type");

    if(alt_type){
      content = "."+alt_type;
    }

    return content;

  },
  prepareFormData: function(type, file_path){

    var filename = path.basename(file_path)
    var meta = null;
    var content = null;
    var content_alt = "";
    var theme = config.theme;
    var uploaded_file = null;
    var git_branch = gitBranch();

    if(type=="pages"){

      //For the HTML files
      if(file_path.indexOf(".html") !== -1){

        //Get meta from page-name.json
        var filename_minus_ext = path.basename(file_path, ".html");
        var the_path = path.dirname(file_path);
        meta = JSON.parse(fs.readFileSync(path.join(the_path, filename_minus_ext+'.json')));

        //Content is the .html file
        content = fs.readFileSync(file_path);

      }
      else if(file_path.indexOf(".json") !== -1){

        //Get content from page-name.html
        var filename_minus_ext = path.basename(file_path, ".json");
        var the_path = path.dirname(file_path);
        content = fs.readFileSync(path.join(the_path, filename_minus_ext+'.html'));

        //Meta: This already is page-name.json
        meta = JSON.parse(fs.readFileSync(file_path));

      }

    }
    else if(type=="theme"){

      //No content.
      content = {};

      //theme.json is ALL meta.
      meta = JSON.parse(fs.readFileSync(file_path));

    }
    else if(type=="blocks"){

      //Prepare file info
      var ext = path.extname(file_path);
      var filename_minus_ext = path.basename(file_path, ext);
      var dir_path = path.dirname(file_path);
      var json_path = null;
      var content_path = null;

      //--------------------------------
      //If JSON file, then use meta

      if(ext == ".json"){

        json_path = file_path;

        //Check for meta file existence
        if(!c.fileExists(json_path)){
          c.log(chalk.bold.red("ERROR: ")+"Missing JSON file: "+json_path);
          return null;
        }

        //Meta: get from the .json file
        try {
          meta = JSON.parse(fs.readFileSync(json_path));
        } catch (e) {
          c.log(chalk.bold.red("ERROR: ")+"Error in JSON syntax: "+json_path);
          c.log(e);
          return null;
        }

      }

      //--------------------------------
      //If HTML/CSS/JS file, then use content

      if(ext != ".json"){

        content_path = file_path;
        var content_ext = path.extname(content_path);
        var format = content_ext.replace('.','');
        var basename = path.basename(content_path, content_ext);


        //Check for content file existence
        if(!c.fileExists(content_path)){
          c.log(chalk.bold.red("ERROR: ")+"Missing content file: "+content_path);
          return null;
        }

        //Use the meta / JSON to get the "alt_type" and correct extension
        // var content_ext = module.exports.util.getContentExt(meta);

        //Convert special markup (Pug/Jade, Stylus, CoffeeScript, etc.)
        // - content will hold the rendered "vanilla" markup
        // - content_alt will hold the original "special" markup
        if(c.val(module.exports.convert, format)){
          var block_type = contentAltTypes[format];
          var block_alt_type = format;
          var file_data = fs.readFileSync(content_path, 'utf8');
          content = module.exports.convert[format](file_data);
          content_alt = file_data;
        }
        //...or just use the file.
        else {
          var block_type = format;
          var block_alt_type = "";
          content = fs.readFileSync(content_path, 'utf8');
        }

        //Set up default meta
        meta = {
          title: basename,
          type: block_type,
          alt_type: block_alt_type
        }

        // console.log(meta);
        // console.log(content);

      }

    }
    else if(type=="templates"){

      content = fs.readFileSync(file_path, "utf8");

    }
    else if(type=="files"){

      var file_with_dir = file_path.replace(config.watch.path+"/files/", "")

      meta = { file_path: file_with_dir };

      uploaded_file = fs.readFileSync(file_path).toString('base64');
      // uploaded_file = fs.readFile(file_path);
      // uploaded_file = fs.createReadStream(file_path);
    }

    //Return the prepared response
    return {

      meta: meta,
      content: content,
      uploaded_file: uploaded_file,

      //for alt_text (jade rather than html, etc.)
      content_alt: content_alt,

      //For git branch
      git_branch: git_branch,

      //Add API key
      key: config_methods.getApiKeyForTheme(),

      //Include the theme info in case this is new git branch
      theme: theme

    };

  },
  getUrl: function(type, file_path){
    var ext = path.extname(file_path);
    var name = path.basename(file_path, ext);
    return protocol + config.theme.domain
           + "/api/v2/themes/" + config.theme.id
           + ds + type + ds + name;
  }
}

//Create alias for usage in "main" below:
var methods = module.exports.util;

//Main file methods, called by monitor.js
module.exports.main = {

  changed: function(file_path){

    // console.log("Checking .watchignore list.");
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

    //If formData is null, then there was an error
    if(!formData){
      return false;
    }

    request.put({
      url: url,
      form: formData
      // formData: formData
    }, function(err, httpResponse, body){

      var result = handleSyncResponse(err, body, file_path, "Updated");

      if(!result){
        c.debug(chalk.bold.red("ERROR: ")+url, 0);
      }

    })

  },
  removed: function(file_path){

    if(methods.checkIgnoreThisPath(file_path)){
      return false;
    }

    //If it's the theme.json file, then do nothing.
    if(file_path.indexOf(ds+"theme.json")){
      return false;
    }

    var type = methods.getTypeFromPath(file_path);
    var url = methods.getUrl(type, file_path);

    request.delete(url, function(err, res, body){

      return handleSyncResponse(err, body, file_path, "Removed");

    });

  },
  created: function(file_path){

    if(methods.checkIgnoreThisPath(file_path)){
      return false;
    }

    var type = methods.getTypeFromPath(file_path);
    var url = methods.getUrl(type, file_path);
    var formData = methods.prepareFormData(type, file_path);

    //If formData is null, then there was an error
    if(!formData){
      return false;
    }

    request.post({
      url: url,
      form: formData
    }, function(err, httpResponse, body){

      return handleSyncResponse(err, body, file_path, "Created");

    })

  }
}

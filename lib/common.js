

var _ = require('underscore'),
  util = require('util'),
  moment = require('moment'),
  fs = require('fs'),

  settings = require('./settings').get()


exports.debug = function(x, debug_level){

  var debug_level = debug_level || null;

  if(typeof x == 'object'){
    x = JSON.stringify(x, null, 2);
  }

  if(debug_level <= settings.debug_level || !debug_level){
    console.log('('+moment().format('YYYY-MM-DD HH:mm:ss')+') '+x);
  }

}


exports.o = function (x) {
    console.log('('+moment().format('YYYY-MM-DD HH:mm:ss')+') '+util.inspect(x, false, null));
}
exports.c = function (x) {
    console.log('('+moment().format('YYYY-MM-DD HH:mm:ss')+') '+x);
}

//Timestamped console output
exports.tc = function (x) {
    console.log('('+moment().format('YYYY-MM-DD HH:mm:ss')+') '+x);
}


//Error
exports.e = function (x, stack) {

  var stack = stack || false;

  //add some kind of report back to central errors database
  //...

  console.log('('+moment().format('YYYY-MM-DD HH:mm:ss')+') '+x);

  if(stack)
    console.log('('+moment().format('YYYY-MM-DD HH:mm:ss')+') '+stack);

}

//Error
exports.ex = function (error_message, res, req) {

    //add some kind of report back to central errors database
    //...

    res.render('error', {error: error_message});

    console.log(error_message);

}

exports.truthy = function(x) {
  if(
    (typeof x !== 'undefined') &&
    (x !== false) &&
    (x != null) &&
    (!_.isEmpty(x))
    )
    return true;
  else
    return false;
}


exports.getValueSafe = function(x, y) {
  return _(x).has(y) ? x[y] : null;
}


exports.getJSONfromResponse = function(response_body){

  var json = {};

  // c.o(response_body)
  // c.o('oink')

  if(response_body !== null && typeof response_body === 'object')
    json = {success: true, data: response_body, error: null}
  else{
    try{
      var parsed = JSON.parse(response_body);
      json = {success: true, data: parsed, error: null}
    }
    catch(e){
      json = {success:false, data: [], error: e};
      exports.writeLastRemoteErrorPage(response_body)
      // c.o()
    }
  }

  return json;

}




exports.writeLastRemoteErrorPage = function(data){

  exports.debug("Writing error page.", 4);

  fs.writeFile("last-remote-error.html", data, function(err) {
    if(err) {
      exports.c("Error page failed to write.");
      exports.c(err);
    } else {
      exports.c("Error written to error page.");
    }
  });

}



exports.bytesToSize = function(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

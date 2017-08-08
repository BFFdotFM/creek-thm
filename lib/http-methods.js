var chalk = require('chalk');
var c = require('./common');

module.exports.handleSyncResponse = function(err, body, file_path, success_word){

  var json = c.getJSONfromResponse(body);

  c.debug(json, 2);

  // console.log(json);

  if(err){
    c.debug(chalk.bold.red("ERROR: ")+"Error while saving: "+err, 0);
    return false;
  }
  if(json.error){
    c.debug(chalk.bold.red("ERROR: ")+"Error in save response: "+json.error, 0);
    return false;
  }
  if(json.data.success){
    c.debug(chalk.bold.green(success_word+": ")+file_path, 0);
    return true;
  }
  else {
    if(json.data && json.data.errors){
      error = json.data.errors[0];
    }
    c.debug(chalk.bold.red("ERROR: "+error), 0);
    return false;
  }

}

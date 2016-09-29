var chalk = require('chalk');
var c = require('./common');

module.exports.handleSyncResponse = function(err, body, file_path, success_word){

  var json = c.getJSONfromResponse(body);

  if(err){
    c.debug(chalk.bold.red("ERROR: ")+"Error while saving: "+err);
    return false;
  }
  if(json.error){
    c.debug(chalk.bold.red("ERROR: ")+"Error in save response: "+json.error);
    return false;
  }
  if(json.data.success){
    c.debug(chalk.bold.green(success_word+": ")+file_path, 1);
    return true;
  }
  else {
    c.debug(chalk.bold.red("ERROR: "), 1);
    c.debug(json, 1);
    return false;
  }

}

var git = require("git-rev-sync");

module.exports = function(){
  //Get git branch of the current working directory
  try{
    return git.branch(process.cwd());
  }catch(e){
    return null;
  }
}

exports.getDate = function(){
  //To get the current date and set the heading
  var today = new Date();
  var options = {
    weekday : 'long',
    month : 'long',
    day : 'numeric'}
  return today.toLocaleDateString("en-US", options);

}

exports.getDay = function(){
  //To get the current date and set the heading
  var today = new Date();
  var options = {
    weekday : 'long',
  }
  return today.toLocaleDateString("en-US", options);

}

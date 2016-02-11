
module.exports = {

  foo: function(str){
    return new Promise(function(resolve, reject){
      if (typeof(str) !== 'string') {
        reject(str + ' is not a string');
      }
      else {
        resolve(str+' foo');
      }
    })
  },

  bar: function(str){
    return new Promise(function(resolve, reject){
      if (typeof(str) !== 'string') {
        reject(str + ' is not a string');
      }
      else {
        resolve(str+' bar');
      }
    })
  }

}

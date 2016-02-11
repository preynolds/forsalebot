var blah = require('./foo');

blah.foo('foodata')
  .then( function(value) { console.log('call1 ' + value); return blah.bar(value +' bardata'); })
  .then( function(value) { console.log('call2 ' + value); });

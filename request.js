var request = require('request');

var requests = [];

var urls = ['http://www.helifreak.com', 'http://exmple.net', 'http://www.apple.com'];

for (var i = urls.length - 1; i >= 0; i--) {
  request(urls[i], function (error, response, body) {
    if (!error && response.statusCode == 200) {
      requests.push({'url':urls[i], 'body': body});
      display(body);
    }
  });
};

function display(body) {
  console.log(body);
}

console.log(requests);
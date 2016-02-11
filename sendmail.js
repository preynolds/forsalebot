sendmail = require('sendmail')();

sendmail({
    from: 'no-reply@forsalebot.com',
    to: 'patrick@soniczen.com',
    subject: 'test sendmail',
    content: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport();

if (process.env.NODE_ENV == 'development') {
  var transporter = nodemailer.createTransport(process.env.NODEMAILER_TRANSPORT);
}

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Forsale Bot 👥 <no-reply@forsalebot.com>', // sender address
    to: 'patrick@soniczen.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

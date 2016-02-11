var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY;
  }
}

var transporter = nodemailer.createTransport(sgTransport(options));


// send mail with defined transport object
module.exports = {

  composedev: function(address, body){
    return new Promise(function(resolve, reject){
      resolve('sent');
    });
  },

  compose: function(address, bodyText, bodyHTML){
    var mailOptions = {
      from: 'For Sale Bot <do-not-reply@forsalebot.com>', // sender address
      to: address, // list of receivers
      subject: 'Forsalebot update', // Subject line
      text: 'Please use an HTML capable mail reader', // plaintext body
      html: bodyHTML // html body
    };

    return new Promise(function(resolve, reject){
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          reject(error);
        }
        else {
          resolve(info);
        }
      });
    });

  }

}

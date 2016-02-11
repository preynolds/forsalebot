var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');
//var Forum = require('../models/forum');

module.exports = function(passport){

  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    //console.log('serializing user: ');console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .select("+password")
      .populate( { path: 'tasks', options: { sort: { '_id': -1 } } } )
      .exec(function (err, user) {
        var options = {
          path: 'tasks.forum',
          model: 'Forum'
        };
        User.populate(user, options, function (err, projects) {
          var options = {
            path: 'tasks.forum.provider',
            model: 'Provider'
          };
          User.populate(user, options, function (err, projects) {
            //console.log('deserializing user:', user);
            done(err, user)
          });
        });        
    });
  });

  // Setting up Passport Strategies for Login and SignUp/Registration
  login(passport);
  signup(passport);

}
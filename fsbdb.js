// TODO: Change fsbdb.js to a module.exports pattern

var User = require('./models/user')
var Provider = require('./models/provider')
var Forum = require('./models/forum')
var Task = require('./models/task')

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var ObjectId = mongoose.Types.ObjectId;

function fsbdb () {
  // Connect if we are not currently connected
  if(mongoose.connections[0].host == null){
    mongoose.connect('mongodb://localhost/forsalebot');
  };
  console.log("fsbdb init");
};

fsbdb.prototype.createProvider = function(name, prettyName, url, topicUrl, selector, callback) {
  Provider.create(
    {
      name: name,
      prettyName: prettyName,
      url: url,
      topicUrl: topicUrl,
      selector: selector
    },
    function(err, doc){
      if(err) {
        console.log(err);
      }
      else {
        callback(doc);
      }
  });
};

fsbdb.prototype.createForums = function(arr, callback) {
  console.log('createForum');

  Forum.collection.insert(arr, function(err, docs){
    if (err) {
      console.log(err);
    }
    else{
      callback(docs);
    }
  });
};


fsbdb.prototype.getForum = function(title, callback) {
  Forum.findOne({ title: new RegExp(title) }, function(err, doc) {
    if(err) {
      console.log('err', err);
    }
    else {
      callback(doc);
    }
  });
};

fsbdb.prototype.getForums = function(callback) {
Forum.find({})
  .populate('provider', 'name prettyName')
    .exec(function (err, docs) {
      if(err) {
        console.log(err);
      }
      else {
        callback(docs);
      }
  });
};

fsbdb.prototype.getForumsWithTasks = function(callback) {
  var self = this;
  Forum.find({ tasks: { '$gt': [] } })
    .populate({path: 'provider'})
    .populate({path: 'tasks'})
    .exec(function (err, docs) {
      if(err) {
        console.log(err);
      }
      else {
        // Deep populate http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
        var options = {
          path: 'tasks.creator',
          model: 'User'
        };
        Forum.populate(docs, options, function (err, projects) {
          callback(docs);
        });
      } //else
  });
};

fsbdb.prototype.createUser = function(name, email, callback) {
  var self = this;
  User.find({ email: new RegExp(email) }, function(err, doc) {
    if(err) {
      console.log(err);
    }
    else {
      User.create(
        {
          name: name,
          active: true,
          email: email
        },
        function(err, createdUser){
          if(err) {
            console.log(err);
          }
          else {
            callback(createdUser);
          }
      });
    }
  });
};

fsbdb.prototype.getUser = function(email, callback) {
  User.findOne({ email: new RegExp(email) }, function(err, foundUser) {
    if(err) {
      console.log('err', err);
    }
    else if (foundUser == null) {
      console.log('User not found');
    }
    else {
      callback(foundUser)
    }
  });
};

fsbdb.prototype.getUserAndTasks = function(id, callback) {
  var self = this;
  User.findOne({ _id: id })
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
          callback(user);
        });
      });
  });
};

fsbdb.prototype.getAllUsersAndTasks = function(callback) {
  var self = this;
  User.find()
    .populate( { path: 'tasks', options: { sort: { 'updated': -1 } } } ) // only works if we pushed refs to children
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
          callback(user);
        });
      });
  });
};

fsbdb.prototype.deleteUser = function(email, callback) {
  var self = this;
  User.find({ email: new RegExp(email) }, function(err, doc) {
    if(err) {
      console.log(err);
    }
    else {
      // found, so delete
      if (doc.length === 1) {
        User.findOneAndRemove({ email: new RegExp(email) }, function(err, doc) {
          if(err) {
            console.log(err);
          }
          else {
            callback(doc);
          }
        });
      }
      // nada
      else {
        console.log('Not found.');
      }
    }
  });
};

fsbdb.prototype.deleteAll = function(callback) {
  console.log('deleteall');
  var self = this;
  var respArr = [];
  User.find(function(err, resp) {
    console.log('user find');
    Task.find().remove(function(err, resp) {
      respArr.push(resp);
      Provider.find().remove(function(err, resp) {
        respArr.push(resp);
        Forum.find().remove(function(err, resp) {
          respArr.push(resp);
          callback(respArr);
        });
      });
    });
  });
};


fsbdb.prototype.deleteTask = function(taskId, userId, callback) {
  Task.findOne({ _id: taskId }, function(err, doc){
    if(err) {
      console.log(err);
    }
    else{
      // auth check
      if(doc.creator.toString() == userId.toString()) {
        // Delete task
        Task.findOneAndRemove({ _id: taskId }, function(err, doc) {
          if(err) {
            console.log(err);
          }
          else {
            // Delete refs
            User.update({ _id: userId }, {$pull: {tasks: taskId}}, function(err, bla) {
              if(err) {
                console.log(err);
              }
              else {
                Forum.update({ _id: doc.forum }, {$pull: {tasks: taskId}}, function(err, bla) {
                  if(err) {
                    console.log(err);
                  }
                  else {
                    callback(doc);
                  }
                }); // forum
              }
            }); // user
          }
        }); // task
      }
    }
  });
};

// store result, if result exists then do nothing
fsbdb.prototype.updateTask = function(taskId, result, callback) {
  Task.findOne({ _id: taskId }, function(err, doc){
    if(err) {
      console.log(err);
    }
    else{
      var doUpdate = true;
      for (var i = doc.results.length - 1; i >= 0; i--) {
        if (doc.results[i].topicId == result.topicId) {
          doUpdate = false;
          callback('exists');
          break;
        }
      }; // for
      if (doUpdate) {
        Task.update({ _id: taskId }, {$push: {results: result}}, function(err, doc) {
          if(err) {
            console.log(err);
          }
          else {
            callback(doc);
          }
        }); // task.update
      }; // if
    }; // else
  }); // find
};

/*fsbdb.prototype.updateResultAsSent = function(taskId, resultId, callback) {
  Task.update(
    {
      results._id: resultId
    },
    {
      $push: {results.sent: true}
    },
    function(err, doc) {
      if(err) {
        console.log(err);
      }
      else {
        callback(doc);
      }
  }); // task.update
};*/


fsbdb.prototype.createTask = function(theTask, callback) {
  // TODO: Convert createTask to promises
  console.log(theTask);
  var self = this;
  // Check to make sure we have a user to assign this task to
  User.findOne({ _id: theTask.user }, function(err, foundUser) {
    if(err) {
      console.log('err', err);
    }
    else if (foundUser == null) {
      console.log('User not found');
    }
    else {
      // TODO: Check for dupe task
      Task.create(
        {
          name: theTask.name,
          forum: theTask.forum,
          needle: theTask.needle,
          creator: theTask.user
        },
        function(err, createdTask){
          if(err) {
            console.log(err);
          }
          else {
            var uid = createdTask.creator; // update user with task
            User.update({ _id: uid }, {$push: {tasks: createdTask._id}}, function(err, bla) {
              if(err) {
                console.log(err);
              }
              else {
                var fid = createdTask.forum; // update forum with task
                Forum.update({ _id: fid }, {$push: {tasks: createdTask._id}}, function(err, bla) {
                  if(err) {
                    console.log(err);
                  }
                  else {
                    callback(createdTask);
                  }
                });
              }
            }); // user.update
          }
        }
      ); // Task.create
    }
  }); // User.findOne
};

fsbdb.prototype.getTasksByUserId = function(userId, callback) {
  Task.find({creator: userId}, function(err, doc) {
    if(err) {
      console.log(err);
    }
    else {
      if (doc.length > 0) {
        callback(doc);
      }
      // dupe
      else {
        console.log('No tasks');
      }
    }
  });
};

fsbdb.prototype.getTasks = function(callback) {
  Task.find(function(err, doc) {
    if(err) {
      console.log(err);
    }
    else {
      if (doc.length > 0) {
        callback(doc);
      }
      // dupe
      else {
        console.log('No tasks');
      }
    }
  });
};

fsbdb.prototype.deleteAllResults = function(callback) {
  console.info('deleteAllResults');
  Task.update({}, {results:[]}, {multi: true}, function(err, doc) {
    if(err) {
      console.log(err);
    }
    else {
      callback(doc);
    }
  });
};

fsbdb.prototype.close = function() {
  mongoose.disconnect();
};



module.exports = fsbdb;

//var bob = new Db();

//bob.createUser('Patrick', 'patrick@p.com');
//bob.createUser('Bob', 'bob@p.com');

//getUser('patrick@p.com');
//getUser('patrick@poop.com');
//deleteUser('patrick@p.com');


// setTask('54def41080294cff11616503', { "6hv": {
//     "provider": "helifreak",
//     "forum": "ehelis",
//     "needle": ["6hv"] } } );

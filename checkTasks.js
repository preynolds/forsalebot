var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
var async = require('async');

var mailer = require('./mailer');

// fsb classes
var Fsbdb = require('./fsbdb');
var fsbdb = new Fsbdb();

// //init populate
// var GetForums = require('./GetForums.js');
// var getForums = new GetForums();

var taskSearchAndUpdate = function() {
  // TODO: Convert taskSearchAndUpdate to promises instead of waterfall
  async.waterfall([
    // curl forums
    function(callback){
      var curlsData = [];
      var curlsCount = 0;
      fsbdb.getForumsWithTasks(function(forums){
        var curls = [];
        _.each(forums, function(forum, idx){
          request(forum.provider.url+forum.url, function (error, response, body) {
            if (error) {
              console.log('Unknown Error', err);
            };
            curlsData.push({'forum':forum, 'body':body});
            curlsCount++;
            if (curlsCount == forums.length) {
              callback(null, curlsData);
            };
          });
        }) // _.each
      }) // fsbdb.
    },
    // select titles from HTML
    function(curls, callback){
      var curlsCount = 0;
      _.each(curls, function(curl, idx){
        $ = cheerio.load(curl.body);
        // TITLES
        curl.titles = $('body').find(curl.forum.provider.selector);
        curlsCount++;
        if (curlsCount == curls.length) {
          callback(null, curls);
        };
      });
    },
    // matchy match
    function(curls, callback){
      /*
      loop through forums (curls)
      then loop over each title for that forum
      then string match each forumtask to title and store result on the task obj
      */
      var results = [];
      var curlsCount = 0;
      _.each(curls, function(curl){
        console.log('-----> ' + curl.forum.provider.name + ' ' + curl.forum.title);
        // now we have titles, so let's run the tasks
        _.each(curl.titles, function(element){
          // normalize titles first for searching
          var topicId = element.attribs.href.split('?')[0]+'?t='+element.attribs.href.split('t=')[1];
          var realTitle = element.children[0].data;
          var cleanTitle = element.children[0].data.toLowerCase();
          // run through tasks
          _.each(curl.forum.tasks, function(task){
            var score = 0;
            var needleSet = task.needle.split(',');
            _.each(needleSet, function(needle) {
              if (cleanTitle.indexOf(needle) > -1) {
                score++;
              }
            }); // needles
            var scorePercentage = score/needleSet.length;
            if (scorePercentage > 0) {
              var result = {
                'title':realTitle,
                'score':scorePercentage,
                'topicId':topicId
              };
              results.push({'task':task, 'result':result});
            }
          }); // tasks
        }); // curl.titles
        curlsCount++;
        if (curlsCount == curls.length) {
          callback(null, results);
        };
      }); // curlWithTitles
    },
    // store results
    function(results, callback){
      //console.log('results', results);
      async.each(results, function(result, callback2) {
        fsbdb.updateTask(result.task._id, result.result, function(task) {
          if (task == 'exists') {
            console.log('exists');
          }
          else {
            console.log('Result added');
            //console.log(task, result.task);
          }
          callback2();
        });
      },function(err){
          if( err ) {
            console.log('Results failed to process');
          } else {
            console.log('All results have been processed successfully');
            callback(null);
          }
      });
    },
    // emails
    function(callback){
      console.log('-----> Email time');
      fsbdb.getAllUsersAndTasks(function(users){
        async.each(users, function(user, callback2) {
          if (user.tasks.length > 0) {
            console.log(user.email + ' has tasks');
            var userTasks = [];
            // have tasks
            async.each(user.tasks, function(task, callback3){
              var t = {};
              t.name = task.name;
              t.needle = task.needle;
              t.forumProvider = task.forum.provider.prettyName;
              t.forumTitle = task.forum.title;
              t.results = [];

              if (task.results.length > 0) {
                // have results
                async.each(task.results, function(result, callback4){
                  var r = {};
                  r.link = task.forum.provider.url+task.forum.provider.topicUrl+result.topicId
                  r.title = result.title;
                  r.sent = result.sent;
                  t.results.push(r);
                  callback4(null);
                }); // _.each(user.tasks.results)
              }
              userTasks.push(t);
              callback3(null);
            }); // _.each(user.tasks)
            emailStuff(user, userTasks, function(emailResults){
              console.log('emailResults', emailResults);
            });
          };
          callback2(null);
        },function(err, blah){
          if( err ) {
            console.log('Users failed to process');
          } else {
            console.log('All users have been processed successfully');
            callback(null);
          }
        });
      }); // fsbdb.
    },
    function(callback){
      callback(null);
    }
  ], function (err) {
     console.log('Done');
     fsbdb.close();
  });
};

taskSearchAndUpdate();


var emailStuff = function(user, userTasks, callback) {
  console.log('emailing ' + user.email);

  formatTasksForEmail(user, userTasks)
    .then(function(json) {
      return mailer.compose(user.email, json, json);
    })
    .then(function(res){
      // updateTaskResultsAsSent(user, userTasks, function(updateStatus){
      console.log('response', res);
      callback('email sent');
      // })
    });

  // alltasks += '\n<h3>name: '+task.name+'  search terms: '+task.needle+'  forum: '+task.forum.provider.prettyName+'/'+task.forum.title+'</h3>\n';
  // html = '<p><a href="'+task.forum.provider.url+task.forum.provider.topicUrl+result.topicId+'">'+result.title+'</a></p>\n';
};

var formatTasksForEmail = function(user, userTasks){
  return new Promise(function(resolve, reject) {

    var body = '<h3>Recently added items</h3>';

    _.each(userTasks, function(task, index){
      if (task.results.length > 0) {
        var notSentResults = _.filter(task.results, function(t){
          return t.sent == false;
        });
        if (notSentResults.length > 0) {
          body += '<h4>Name: '+task.name+' // Search query: '+task.needle+'  // Forum: '+task.forumProvider+'/'+task.forumTitle+'</h4>';
        }
        _.each(notSentResults, function(result, index2){
          body += '<p><a href="'+result.link+'">'+result.title+'</a></p>';
        });
      }
    });

    body += '<h3>Archived results</h3>';

    _.each(userTasks, function(task, index){
      if (task.results.length > 0) {
        var sentResults = _.filter(task.results, function(t){
          return t.sent !== false;
        });
        if (sentResults.length > 0) {
          body += '<h4>Name: '+task.name+' // Search query: '+task.needle+'  // Forum: '+task.forumProvider+'/'+task.forumTitle+'</h4>';
        }
        _.each(sentResults, function(result, index2){
          body += '<p><a href="'+result.link+'">'+result.title+'</a></p>';
        });
      }
    });

    console.log(body);
    resolve(body);
  });
};

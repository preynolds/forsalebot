var express = require('express');
var router = express.Router();
var _ = require('underscore');
var async = require('async');
var Fsbdb = require('../fsbdb')
var fsbdb = new Fsbdb();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.setHeader('Last-Modified', (new Date()).toUTCString()); // prevent 304
		fsbdb.getForums(function(forums){
			res.render('home', {
				user: req.user,
				forums: forums
			});
		})
	});

	/* POST AJAX */
	router.post('/ajax', isAuthenticated, function(req, res){
		async.waterfall([
	    function(callback){
	    	_.each(req.body.forums, function(search){
	    		//console.log(search, req.user._id);
	    		fsbdb.createTask(
			      {
			        "name": req.body.name,
			        "forum": search,
			        "needle": req.body.needle.split(","),
			        "user": req.user._id
			      },
			      function(task) {
			      	console.log(task);
			      }
			    );
	    	});
	    	callback(null);
	    }
	  ],function (err) {
	     res.send(req.body);
	  });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// ROUTES FOR API
	// =============================================================================

	router.get('/api/tasks', isAuthenticated, function(req, res) {
		console.log('here');
	  fsbdb.getTasks(function(tasks){
	    res.json(tasks);
	  })
	});

	router.get('/api/forums', function(req, res) {
	  fsbdb.getForums(function(forums){
	    res.json(forums);
	  })
	});

	router.get('/api/userandtasks/:id', function(req, res) {
	  fsbdb.getUserAndTasks(req.params.id, function(user){
	    res.json(user);
	  })
	});

	router.get('/api/allusersandtasks', function(req, res) {
	  fsbdb.getAllUsersAndTasks(function(users){
	    res.json(users);
	  })
	});

	router.get('/api/forumandtasks', function(req, res) {
	  fsbdb.getForumsWithTasks(function(fat){
	    res.json(fat);
	  })
	});

	router.delete('/api/deletetask/:id', isAuthenticated, function(req, res) {
		fsbdb.deleteTask(req.params.id, req.user._id, function (task) {
			res.json(task);
		})
	});

	router.get('/api/clear-results', isAuthenticated, function(req, res){
		fsbdb.deleteAllResults(function(data){
			res.json(data);
		})
	});


	return router;
}

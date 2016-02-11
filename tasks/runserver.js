module.exports = function (grunt) {
  grunt.registerMultiTask('run_server', 'Start web server', function() {
    app.set('port', process.env.PORT || 3000);
    var server = app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + server.address().port);
    });
  });
};
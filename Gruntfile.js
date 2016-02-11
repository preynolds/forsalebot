var path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'bin/server.js'
        }
      }
    },
    esteWatch: {
      options: {
        dirs: ['**/*.js', '!**/node_modules/**'],
        livereload: {
          enabled: false
        }
      },
      '*': function (filepath) {
        var extension = path.extname(filepath);
        switch (extension) {
          case '.js':
            return ['express:dev'];
          case '.css':
            return ['express:dev'];
          case '.html':
            return ['express:dev'];
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-este-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', ['express:dev', 'esteWatch']);

};
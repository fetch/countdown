module.exports = (grunt) ->
  
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    header: """
     /**
      * Countdown, a Counter and Countdown plugin for jQuery
      * by Koen Punt for Fetch!, http://www.fetch.nl
      *
      * Version <%= pkg.version %>
      * Full source at https://github.com/fetch/countdown
      * Copyright (c) <%= grunt.template.today("yyyy") %> Fetch! http://www.fetch.nl
      *
      * MIT License, https://github.com/fetch/countdown/blob/master/LICENSE.md
      */
      """
    coffee:
      options:
        banner: "<%= header %>\n"
      compile:
        files:
          "build/<%= pkg.name %>.js": "src/countdown.coffee"

    uglify:
      options:
        banner: "<%= header %>\n"
      build:
        src: "build/<%= pkg.name %>.js"
        dest: "build/<%= pkg.name %>.min.js"

    copy:
      build:
        files:
          "build/<%= pkg.name %>.css": "src/countdown.css"

    cssmin:
      options:
        banner: "<%= header %>\n"
      build:
        files:
          "build/<%= pkg.name %>.min.css": "build/<%= pkg.name %>.css"

  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-cssmin"

  # Default task(s).
  grunt.registerTask "default", ["build"]
  grunt.registerTask "build", ["coffee", "uglify", "copy", "cssmin"]

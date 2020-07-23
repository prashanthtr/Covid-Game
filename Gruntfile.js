module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        terser: {
            default_options: {
                options: {
                    ecma: 2015, // specify one of: 5, 2015, 2016, etc.
                    module: true,
                    toplevel: true
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'www/',      // Src matches are relative to this path.
                        src: ['appscripts/main2.js','appscripts/graphs.js','appscripts/resources.js'], // Actual pattern(s) to match.
                        dest: 'build/',   // Destination path prefix.
                        extDot: 'first'   // Extensions in filenames begin after the first dot
                    },
                ]
            },
        },
        jshint: {
            src: ['www/**/*.js'],
            options: {
                esversion: 6,
                eqeqeq: true ,
                smarttabs:true ,
                laxcomma:true ,
                laxbreak:true ,
                reporter:'checkstyle' ,
                reporterOutput: 'jshint.xml' ,
            }
        },
    });


    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-terser');

    //correct code
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint','terser']);
};

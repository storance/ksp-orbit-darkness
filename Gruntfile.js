module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy : {
            dist: {
                files: [
                {
                    expand: true,
                    cwd: "bower_components/jquery/dist/",
                    src: "jquery.min.js",
                    dest: "vendor/js/"
                },
                {
                    expand: true,
                    cwd: "bower_components/bootstrap/dist/css/",
                    src: "bootstrap.min.css",
                    dest: "vendor/css/"
                },
                {
                    expand: true,
                    cwd: "bower_components/angular/",
                    src: "angular.min.js",
                    dest: "vendor/js/"
                },
                {
                    expand: true,
                    cwd: "bower_components/angular-route/",
                    src: "angular-route.min.js",
                    dest: "vendor/js/"
                },
                {
                    expand: true,
                    cwd: "bower_components/lodash/",
                    src: "lodash.min.js",
                    dest: "vendor/js/"
                }]
            }
        },
        jshint: {
            all: ['js**/*.js']
        },
        connect: {
            server: {
                port: 8000,
                keepalive: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'copy']);
};

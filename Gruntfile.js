module.exports = function(grunt) {
    var pkg = require('./package.json');

    grunt.initConfig({
        concat: {
            options: {
                process: function (src, b) {
                    return grunt.template.process(src, {data: {api: process.NODE_HOST || '//localhost:3000'}})
                }
            },
            main: {
                src: ['client/*.js'],
                dest: 'public/client.js'
            }
        },
        uglify: {
            main: {
                files: {
                    'browser-extensions/chrome/client.min.js': ['public/client.js'],
                    'public/client.min.js': ['public/client.js']
                }
            }
        },
        watch: {
            files: ['<%= concat.main.src %>'],
            tasks: ['default']
        }
    });

    grunt.registerTask('chrome:manifest', 'Write chrome\'s manifest file', function() {
        var manifest = grunt.file.readJSON('browser-extensions/chrome/manifest.json');
        manifest.description = pkg.description;
        manifest.version = pkg.version;
        manifest.name = pkg.name;
        grunt.file.write('browser-extensions/chrome/manifest.json', JSON.stringify(manifest, null, 4));
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat', 'uglify', 'chrome:manifest']);
};
module.exports = function(grunt) {
    var pkg = require('./package.json');

    grunt.initConfig({
        ractiveparse: {
            options: {
                namespace: 'CLMARK.templates["main"]'
            },
            main: {
                src: ['client/template.mustache'],
                dest: 'public/template.js'
            }
        },
        concat: {
            options: {
                process: function (src, b) {
                    return grunt.template.process(src, {data: {api: process.env.NODE_HOST || '//localhost:3000'}})
                }
            },
            main: {
                src: ['public/template.js', 'client/ractive.js', 'client/index.js'],
                dest: 'public/client.js'
            }
        },
        uglify: {
            main: {
                files: {
                    'dist/browser-extensions/chrome/client.min.js': ['public/client.js'],
                    'dist/public/client.min.js': ['public/client.js']
                }
            }
        },
        watch: {
            files: ['<%= concat.main.src %>'],
            tasks: ['default']
        }
    });

    grunt.registerTask('chrome:manifest', 'Write chrome\'s manifest file', function() {
        var manifest = grunt.file.readJSON('dist/browser-extensions/chrome/manifest.json');
        manifest.description = pkg.description;
        manifest.version = pkg.version;
        manifest.name = pkg.name;
        grunt.file.write('dist/browser-extensions/chrome/manifest.json', JSON.stringify(manifest, null, 4));
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-ractive-parse");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['ractiveparse', 'concat', 'uglify', 'chrome:manifest']);
};
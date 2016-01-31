module.exports = function(grunt) {
    var pkg = require('./package.json');

    grunt.initConfig({
        clean: ["build/public", "build/browser-extensions/chrome/client.min.js"],

        ractiveparse: {
            options: {
                namespace: 'CLMARK.templates["main"]'
            },
            main: {
                src: ['client/template.mustache'],
                dest: 'build/public/template.compiled.js'
            }
        },

        concat: {
            options: {
                process: function (src) {
                    return grunt.template.process(src, {data: {
                        api: process.env.NODE_CLM_HOST || '//localhost:3000',
                        captchaSiteKey: process.env.NODE_CLM_CAPTCHA_SITE_KEY
                    }})
                }
            },
            main: {
                src: ['build/public/template.compiled.js', 'client/ractive.js', 'client/index.js'],
                dest: 'build/public/client.js'
            }
        },

        uglify: {
            main: {
                files: {
                    'build/browser-extensions/chrome/client.min.js': ['build/public/client.js'],
                    'build/public/client.min.js': ['build/public/client.js']
                }
            }
        },

        watch: {
            files: ['<%= concat.main.src %>'],
            tasks: ['default']
        }
    });

    grunt.registerTask('chrome:manifest', 'Write chrome\'s manifest file', function() {
        var manifest = grunt.file.readJSON('build/browser-extensions/chrome/manifest.json');
        manifest.description = pkg.description;
        manifest.version = pkg.version;
        manifest.name = pkg.name;
        grunt.file.write('build/browser-extensions/chrome/manifest.json', JSON.stringify(manifest, null, 4));
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-ractive-parse");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['clean', 'ractiveparse', 'concat', 'uglify', 'chrome:manifest']);
};
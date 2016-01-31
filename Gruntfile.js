var AdmZip = require('adm-zip');
var path = require('path');

module.exports = function(grunt) {
    var pkg = require('./package.json');

    grunt.initConfig({
        clean: {
            main: ["build"],
            after: ["build/*.mustache.js", "build/browser-extensions/*", "!build/browser-extensions/*.zip"]
        },

        ractiveparse: {
            options: {
                namespace: 'CLMARK.templates["main"]'
            },
            main: {
                src: ['src/client/extension.mustache'],
                dest: 'build/extension.mustache.js'
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
                src: ['build/extension.mustache.js', 'src/client/external/*.js', 'src/client/extension.js'],
                dest: 'build/extension.js'
            }
        },

        uglify: {
            main: {
                files: {
                    'build/extension.min.js': ['build/extension.js']
                }
            }
        },

        copy: {
            'client_unminified': {
                src: 'build/extension.js',
                dest: 'build/extension.min.js'
            },
            'extension_chrome': {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'src/client/browser-extensions/chrome/*',
                    dest: 'build/browser-extensions/chrome/'
                }]
            },
            'extension_chrome_client': {
                src: 'build/extension.min.js',
                dest: 'build/browser-extensions/chrome/extension.min.js'
            },
            site: {
                src: 'src/client/site.html',
                dest: 'build/index.html'
            }
        },

        watch: {
            files: ['<%= concat.main.src %>'],
            tasks: ['default']
        }
    });

    grunt.registerTask('build_extension_chrome', 'create chrome extension', function() {
        var manifest = grunt.file.readJSON('src/client/browser-extensions/chrome/manifest.json');
        manifest.description = pkg.description;
        manifest.version = pkg.version;
        manifest.name = pkg.name;
        grunt.file.write('build/browser-extensions/chrome/manifest.json', JSON.stringify(manifest, null, 4));

        var zip = new AdmZip();
        zip.addLocalFolder(path.join(__dirname, 'build/browser-extensions/chrome'));
        zip.writeZip(path.join(__dirname, 'build/browser-extensions/chrome.zip')) ;
    });

    grunt.loadNpmTasks("grunt-ractive-parse");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('dev', ['clean:main', 'ractiveparse', 'concat', 'copy:client_unminified', 'copy:extension_chrome', 'copy:extension_chrome_client', 'build_extension_chrome', 'copy:site', 'clean:after']);
    grunt.registerTask('default', ['clean:main', 'ractiveparse', 'concat', 'uglify', 'copy:extension_chrome', 'copy:extension_chrome_client', 'build_extension_chrome', 'copy:site', 'clean:after']);
};
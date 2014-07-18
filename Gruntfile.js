module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        library: grunt.file.readJSON('bower.json'),

        // Empties folders to start fresh
        clean: {
          dist: {
            files: [{
              dot: true,
              src: [
                '.tmp',
                '<%= pkg.dist %>/*',
                '!<%= pkg.dist %>/.git*'
              ]
            }]
          },
          server: '.tmp'
        },

        concat: {
            options: {
                separator: ''
            },
            library: {
                src: [
                    'src/<%= library.name %>/<%= library.name %>.prefix',
                    'src/<%= library.name %>/<%= library.name %>.js',
                    'src/<%= library.name %>/controllers/**/*.js',
                    'src/<%= library.name %>/directives/**/*.js',
                    'src/<%= library.name %>/filters/**/*.js',
                    'src/<%= library.name %>/services/**/*.js',
                    'src/<%= library.name %>/<%= library.name %>.suffix'
                ],
                dest: 'dist/<%= library.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            jid: {
                files: {
                    'dist/<%= library.name %>.min.js': ['<%= concat.library.dest %>']
                }
            }
        },
        jshint: {
            beforeConcat: {
                src: ['gruntfile.js', '<%= library.name %>/**/*.js']
            },
            afterConcat: {
                src: [
                    '<%= concat.library.dest %>'
                ]
            },
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    angular: true
                },
                globalstrict: false
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: [
                'Gruntfile.js',
                'src/**/*'
            ],
            tasks: ['default']
        },
        ngtemplates: {
          appEmail: {
            cwd : "src",
            src: '<%= library.name %>/views/**/*.html',
            dest: 'dist/<%= library.name %>.templates.js'
          }
        },

        cssmin: {
          add_banner: {
            options: {
              banner: '/* <%= library.name %> CSS file */',
              ext: '.min.css'
            },
            files: {
              '<%= pkg.dist %>/<%= pkg.name %>.css': ['<%= pkg.src %>/**/*.css']
            }
          }
        },

        // Copies remaining files to places other tasks can use
        copy: {
          dist: {
            files: [{
              expand: true,
              dot: true,
              cwd: '<%= pkg.src %>',
              dest: '<%= pkg.dist %>',
              src: [
                '*.{ico,png,txt}',
                '.htaccess',
                'images/{,*/}*.{webp}',
                'fonts/*',
                'styles/*',
                'images/*'
              ]
            }]
          }
        }  
    });

    grunt.registerTask('default', ['clean','jshint:beforeConcat', 'ngtemplates', 'concat', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('livereload', ['default', 'watch']);

};

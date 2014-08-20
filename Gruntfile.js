module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        js_src_path: 'src/js',
        js_distro_path: 'dist',
        css_src_path: 'src/css',
        css_distro_path: 'dist',

        concat: {
            'js': {
                'src': ['<%= js_src_path %>/pyk.js', '<%= js_src_path %>/oneD/oneD.js', '<%= js_src_path %>/oneD/bubble.js', '<%= js_src_path %>/oneD/funnel.js', '<%= js_src_path %>/oneD/percentageColumn.js', '<%= js_src_path %>/oneD/pictograph.js', '<%= js_src_path %>/oneD/pie.js', '<%= js_src_path %>/oneD/pyramid.js', '<%= js_src_path %>/oneD/treemap.js', '<%= js_src_path %>/maps/maps.js', '<%= js_src_path %>/maps/oneLayer.js'],
                'dest': '<%= js_distro_path %>/pykcharts.<%= pkg.version %>.js'
            },
            'css': {
                'src': ['<%= css_src_path %>/*.css'],
                'dest': '<%= css_distro_path %>/pykcharts.<%= pkg.version %>.css'
            }
        },

        uglify: {
            'my_target': {
                'files': {
                '<%= js_distro_path %>/pykcharts.<%= pkg.version %>.min.js': // destination
                ['<%= js_distro_path %>/pykcharts.<%= pkg.version %>.js'] // source
                }
            }
        },

        cssmin: {
            'minify': {
                'expand': true,
                'cwd': '<%= css_distro_path %>/',
                'src': ['pykcharts.<%= pkg.version %>.css', '!*.min.css'],
                dest: '<%= css_distro_path %>/',
                ext: '.<%= pkg.version %>.min.css'
            }
        },

        watch: {
            src: {
                files: ['<%= css_src_path %>/*.css', '<%= js_src_path %>/*.js'],
                tasks: ['build'],
            },
        },

        jshint: {
            all: ['Gruntfile.js', '<%= js_src_path %>/*.js']
        },

        clean: {
            // Clean any pre-commit hooks in .git/hooks directory
            hooks: ['.git/hooks/pre-commit']
        },

        // Run shell commands
        shell: {
            hooks: {
                // Copy the project's pre-commit hook into .git/hooks
                command: 'cp git-hooks/pre-commit .git/hooks/pre-commit'
            },
            rmclogs: {
                // Run the script
                command: 'bash pre-build/script.bash'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Remove all console.logs
    grunt.registerTask('rmconsolelogs', ['shell:rmclogs']);

    // Clean the .git/hooks/pre-commit file then copy in the latest version
    grunt.registerTask('hookmeup', ['clean:hooks', 'shell:hooks']);

    //build task
    grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'rmconsolelogs', 'hookmeup']);

    grunt.event.on('watch', function(action, filepath) {
        grunt.log.writeln(filepath + ' has ' + action);
    });

};

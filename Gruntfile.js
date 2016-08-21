module.exports = function(grunt) {
 require('load-grunt-tasks')(grunt); 
  grunt.initConfig({
    concat: {
      dist: {
        src: [
          './node_modules/jquery/dist/jquery.js',
          './src/script.js',
        ],
        dest: './pub/script.js'
      },
    },
    less: {
      default: {
        options: { compress: true, yuicompress: true },  
        files: { './pub/style.css': './src/style.less' }
      },   
      dev: {
        options: { yuicompress: true },  
        files: { './pub/style.css': './src/style.less' }
      },   
    },  
    uglify: {
      default: {
        files: {'./pub/script.js':['./pub/script.js']}
      }
    },  
    minifyHtml: {
      options: { cdata: true },
      dist: { files: { './pub/index.html': './src/index.html' } }
    },
    concurrent: {
      default: {
        tasks: ['nodemon','watch'],
        options: { logConcurrentOutput: true }
      }
    },
    watch: {
      'grunt': {
        files: ['Gruntfile.js'],
        options: { reload: true }
      },
      'html': {
        files: './src/index.html',
        options: { atBegin: true },
        tasks: ['minifyHtml']
      },
      'js': {
        files: './src/script.js',
        options: { atBegin: true },
        tasks: ['concat']
      },  
      'less': {
        files: ['./src/style.less'],
        options: { atBegin: true },
        tasks: ['less:dev']
      }  
    },
    nodemon: {
      default: {
        script: 'server.js',
        options: { watch: 'server.js' }
      }
    }
  }); 
  grunt.config('env', grunt.option('env') || process.env.GRUNT_ENV || 'development');
  if(grunt.config('env') === 'production') {
    grunt.registerTask('default',['concat','minifyHtml','less','uglify']);
  }else{
    grunt.registerTask('default', ['concurrent']);
  }
};

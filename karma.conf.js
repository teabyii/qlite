module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['mocha'],

    files: [
      'test/**/*.html',
      'test/**/*.js'
    ],

    preprocessors: {
      'src/**/*.js': ['rollup'],
      'test/**/*.js': ['rollup'],
      'test/**/*.html': ['html2js']
    },

    rollupPreprocessor: {
      plugins: [
        require('rollup-plugin-node-globals')(),
        require('rollup-plugin-node-builtins')(),
        require('rollup-plugin-babel')({
          exclude: 'node_modules/**'
        })
      ],
      format: 'iife',
      moduleName: 'qlite',
      sourceMap: 'inline'
    },

    html2JsPreprocessor: {
      stripPrefix: 'test/fixtures/'
    },

    client: {
      mocha: {
        reporter: 'html'
      }
    },

    colors: true,

    browsers: ['PhantomJS'],

    reporters: ['spec', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    }
  })
}

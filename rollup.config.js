import babel from 'rollup-plugin-babel'

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'qlite',
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  dest: 'dist/qlite.js'
}

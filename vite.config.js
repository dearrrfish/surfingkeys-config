/* eslint-disable */
// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/conf.ts'),
      name: 'SurfingkeysConf',
      fileName: (format) => `conf.${format}.js`
    },
    // minify: process.env.VITE_BUILD_MINIFY ? 'esbuild' : false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          window: 'window',
          settings: 'settings',
          api: 'api',
        }
      }
    }
  }
})

const scss = require('postcss-scss');

module.exports = {
  // allows for loading in scss files
  parser: scss,
  plugins: {
    // actually evaluates scss expressions
    '@csstools/postcss-sass': {},

    tailwindcss: {},
    autoprefixer: {}
  }
}

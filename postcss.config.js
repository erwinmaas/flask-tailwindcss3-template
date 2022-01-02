const path = require('path');

module.exports = (ctx) => ({
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
});
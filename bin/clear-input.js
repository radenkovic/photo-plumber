const colors = require('colors');
const fs = require('fs');
const rimraf = require('rimraf');

rimraf('./input', async e => {
  if (e) {
    console.log('Error: Foder failed to clean'.red, e);
    return;
  }
  fs.mkdirSync('input');
  console.log(' Clear Done '.green.inverse, '✓ Input folder cleared.');
});

const colors = require('colors');
const rimraf = require('rimraf');

rimraf('./temp', async e => {
  if (e) {
    console.log('Error: Foder failed to clean'.red, e);
    return;
  }
  console.log(
    ' Clear Done '.green.inverse,
    '✓ Temp folder cleaned, ready for next batch.'
  );
  console.log('To clear input folder type'.yellow, '"yarn clear:input"'.yellow);
});

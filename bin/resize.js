const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const colors = require('colors');
const prepareImages = require('../lib/prepare-images');
const resizeImage = require('../lib/resize-image');
const { writeFilesProcessed } = require('../lib/utils');

// Clear
rimraf('./temp', async e => {
  if (e) {
    console.log('Foder failed to clean', e);
    return;
  }
  try {
    // Read files from input directory
    const INPUT_DIR = path.join(process.cwd(), 'input');
    const filenames = fs.readdirSync(INPUT_DIR);
    if (!filenames.length) {
      console.log(
        ' Nothing to process '.yellow.inverse,
        'directory "input" is empty.'.yellow
      );
      return;
    }
    // Prepare images for resizing
    const images = prepareImages(filenames);
    // Create Dir
    fs.mkdirSync('temp');
    // Resize images
    const promises = images.map(resizeImage);
    const res = await Promise.all(promises);
    writeFilesProcessed(res);
    console.log(
      ' Resize Done '.green.inverse,
      `${res.length}`.green,
      'images resized'
    );
  } catch (e) {
    console.log('Image Resize Failed', e);
    throw new Error(e);
  }
});

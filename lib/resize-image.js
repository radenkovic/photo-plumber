const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

module.exports = async image => {
  const promises = image.size_ids.map(async key => {
    const size = image.sizes[key];
    const inputBuffer = fs.readFileSync(size.input_path);
    const s = sharp(inputBuffer)
      .resize(size)
      .rotate()
      .jpeg({ quality: size.quality || 100 });
    if (size.sharpen) {
      s.sharpen(size.sharpen.sigma, size.sharpen.flat, size.sharpen.jagged);
    }
    try {
      const sharp_data = await s.toFile(size.output_path);
      console.log('✔ Image resized'.green, `${size.output_path}`);
      image.sizes[key].resize_info = sharp_data; // Bind Sharp Data
    } catch (e) {
      console.log('Failed to resize', size);
      throw new Error(e);
    }
  });
  try {
    const res = await Promise.all(promises);
    return image;
    return res;
  } catch (e) {
    throw e;
  }
};

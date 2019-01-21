const mongoose = require('mongoose');

module.exports = mongoose.model('Photo', {
  id: { type: String, required: true },
  size_ids: { type: Array, required: true },
  sizes: { type: Object, required: true }
});

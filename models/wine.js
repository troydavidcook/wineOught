const mongoose = require('mongoose');

// This schema shows the 'ref'erence to different model, like a key would in pSQL.
const wineSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  created: { type: Date, default: Date.now },
  location: String,
  lat: Number,
  lng: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Wine', wineSchema);

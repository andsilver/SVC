const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  creditType: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Credit', schema);

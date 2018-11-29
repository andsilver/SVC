const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  creditType: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  hasReport: {
    type: Boolean,
    default: false
  },
  reportId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Credit', schema);

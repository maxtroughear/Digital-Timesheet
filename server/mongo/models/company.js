const mongoose = require('mongoose');

const { Schema } = mongoose;

const CompanySchema = Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true, // implies index: true
  },
});

module.exports = mongoose.model('Company', CompanySchema);

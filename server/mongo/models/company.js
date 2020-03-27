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
    unique: true, // unique index
  },
});

if (!global.gAutoIndex) { CompanySchema.set('autoIndex', false); }

module.exports = mongoose.model('Company', CompanySchema);

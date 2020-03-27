const mongoose = require('mongoose');

const { twoFactorSchema } = require('./schemas');

const { Schema } = mongoose;

const ServiceAdminSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  twoFactor: {
    type: twoFactorSchema,
    required: true,
    default: {},
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// only enable auto indexing if in development mode and only on the first instance
if (!global.gAutoIndex) { ServiceAdminSchema.set('autoIndex', false); }

module.exports = mongoose.model('ServiceAdmin', ServiceAdminSchema);

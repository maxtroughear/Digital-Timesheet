const mongoose = require('mongoose');

const { twoFactorSchema } = require('./schemas');

const { Schema } = mongoose;

const Company = require('./company');

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
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
  company: {
    type: Schema.Types.ObjectId,
    ref: Company,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

if (!global.gAutoIndex) { UserSchema.set('autoIndex', false); }

module.exports = mongoose.model('User', UserSchema);

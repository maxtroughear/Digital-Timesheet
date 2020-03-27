const mongoose = require('mongoose');

const { Schema } = mongoose;

const twoFactorSchema = Schema({
  enabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  secret: {
    type: String,
    required() {
      return this.enabled === true;
    },
  },
  // backups: {
  //   type: Array,
  //   required() {
  //     return this.enabled === true;
  //   },
  // },
});

module.exports = twoFactorSchema;

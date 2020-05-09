const qrcode = require('qrcode');
const { authenticator } = require('otplib');

const generateQR = async (username, secret) => {
  const otpAuth = authenticator.keyuri(username, global.gServiceName, secret);
  return qrcode.toDataURL(otpAuth);
};

module.exports = {
  generateQR,
};

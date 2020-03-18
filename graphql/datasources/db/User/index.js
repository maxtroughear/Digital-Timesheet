const UserModel = require('./_model');
const UserSchema = require('./_schema');

module.exports = db => {
	new UserModel({ User: db.model('User', UserSchema)});
};
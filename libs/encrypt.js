var bcrypt = require('bcrypt');

module.exports.compareSync = bcrypt.compareSync;

module.exports.encryptPassword = function ecnryptPassword(myPlaintextPassword) {
    var saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(myPlaintextPassword, salt);
    return hash;
}
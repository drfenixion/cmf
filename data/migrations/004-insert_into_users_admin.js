
var encrypt = require('../../libs/encrypt.js');
var moment = require('moment');
var datetime = moment().format('YYYY-MM-DD HH:mm:ss');

exports.up = function (next) {
  this.execQuery('INSERT INTO user '
  	+ '(user_name, password, first_name, second_name, height, sex, age, admin, approved, created_at)'
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?, ?, ?), '
    + '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
    	'admin', encrypt.encryptPassword('admin'), 'Иван', 'Иванов', 180, 1, 1987, 1, 1, datetime,
    	'moonrunner', encrypt.encryptPassword('admin'), 'Степан', 'Гаврилов', 180, 1, 1987, 0, 0, datetime,
    	'martian', encrypt.encryptPassword('admin'), 'Пришелец', 'Марсов', 180, 1, 1987, 0, 0, datetime,
    	'elonmask', encrypt.encryptPassword('admin'), 'Илон', 'Маск', 180, 1, 1987, 0, 0, datetime
    ], next);
};

exports.down = function (next) {
  this.execQuery('DELETE FROM user WHERE user_name = (?) OR user_name = (?)'
  	+ ' OR user_name = (?) OR user_name = (?)',
   ['admin', 'moonrunner', 'martian', 'elonmask',], next);
};
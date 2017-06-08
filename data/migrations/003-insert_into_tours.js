var moment = require('moment');
var datetime = moment().format('YYYY-MM-DD HH:mm:ss');

exports.up = function(next) {
    this.execQuery('INSERT INTO tour (name, created_at, short_name)' +
        ' VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)', [
            'Бюджетный базовый тур', datetime, 'Дешовый',
            'Тур средней стоимости с расширенной программой', datetime, 'Средний',
            'Мега тур по обратной стороне луны, осмотр базы пришельцев', datetime, 'Дорогой',
        ], next);
};

exports.down = function(next) {
    this.execQuery('DELETE FROM tour WHERE short_name = (?) OR short_name = (?) OR short_name = (?)', [
        'Дешовый',
        'Средний',
        'Дорогой'
    ], next);
};

var encrypt = require('../../libs/encrypt');
var moment = require('moment');

module.exports = function (orm, db) {
	var User = db.define('user', {
	    id           : { type : "serial", key: true }, // auto increment
	    user_name    : { type : "text", required: true },
	    password     : { type : "text", required: true },
	    first_name   : { type : "text", required: true },
	    second_name  : { type : "text", required: true },
	    height       : { type : "integer", size: 4 , required: true },
	    sex          : { type : "integer", size: 2 , required: true },
	    age          : { type : "integer", size: 2 , required: true },
	    tour_id      : { type : "integer", size: 2 },
	    admin        : { type : "integer", size: 2 , defaultValue: 0 },
	    approved     : { type : "integer", size: 2 , defaultValue: 0 },
	    about_myself : { type : "text"},
	    created_at   : { type : "date", time: true }
	}, 
	{
	    hooks: {
	      beforeValidation: function () {
	        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
	      },
	      beforeCreate: function(){
	      	this.password = encrypt.encryptPassword(this.password);
	      }
	    },
	    validations: {
	      user_name     : orm.enforce.unique({ ignoreCase: true }, "Имя пользователя уже занято."),
	      password      : orm.enforce.ranges.length(5, undefined, "Слишком короткий пароль. Используйте больше 5ти символов."),
	      first_name    : orm.enforce.notEmptyString("Имя должно быть заполнено."),
		  second_name   : orm.enforce.notEmptyString("Фамилия должна быть заполнена."),
		  height        : orm.enforce.ranges.number(100, 300, "Мы принимаем заявки только от людей ростом от 100 см. до 300 см."),
		  sex           : orm.enforce.ranges.number(1, 2, "Неверно указан пол."),
		  age           : orm.enforce.ranges.number(1900, 1999, "Мы принимаем заявки только от людей с 1900 и до 1999 года рождения."),
		  tour_id       : orm.enforce.ranges.number(0, undefined, "Нерабочий tour_id."),
		  admin         : orm.enforce.ranges.number(0, 1, "Нерабочий admin id."),
	    },
	    methods: {
	      serialize: function () {
	        return {
	        	id           : this.id,
	        	user_name    : this.user_name,
	        	password     : this.password,
	        	first_name   : this.first_name,
	        	second_name  : this.second_name,
	        	height       : this.height,
	        	sex          : this.sex,
	        	age          : this.age,
	        	tour_id      : this.tour_id,
	        	admin        : this.admin,
	        	approved     : this.approved,
	        	about_myself : this.about_myself,
	          	created_at   : this.created_at
	        }
	      }
	    }
  	});

  	//User.hasOne('tour', db.models.tour, { required: true, reverse: 'tours', autoFetch: true });
};
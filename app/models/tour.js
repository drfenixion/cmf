
var moment = require('moment');

module.exports = function (orm, db) {
	var Tour = db.define('tour', {
	    id           : { type : "serial", key: true }, // auto increment
	    name         : { type : "text", required: true },
	    short_name   : { type : "text", required: true },
	    created_at   : { type : "date", time: true }
	}, 
	{
		cache: false,
	    hooks: {
	      beforeValidation: function () {
	        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
	      }
	    },
	    validations: {
	      name   : orm.enforce.ranges.length(1, 200)
	    },
	    methods: {
	      serialize: function () {
	        return {
	        	id         : this.id,
	        	name       : this.name,
	        	short_name : this.short_name,
	          	created_at : this.created_at
	        }
	      }
	    }
  	});
};
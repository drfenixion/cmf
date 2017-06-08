
var encrypt = require('../../libs/encrypt');
var moment = require('moment');

module.exports = {
  list: function (req, res, next) {
    req.models.user.find().limit(10).order('-id').all(function (err, resultMatches) {
      if (err) return next(err);

      var items = resultMatches.map(function (m) {
        return m.serialize();
      });

      res.send({ items: items });
    });
  },
  displayLogin: function (req, res, next) {
  	if(req.session.authenticated === 1){
  		return res.redirect('/');
  	}
	res.render('auth/login');	
  },
  proceedLogin: function (req, res, next) {
  	
  	var user_name = req.body.user_name;
  	var password  = req.body.password;

    req.models.user.find({ user_name: user_name }).limit(1)
    	.all(function (err, resultMatches)
    {

      if (err) return next(err);

      if(resultMatches[0] == undefined){
      	req.flash("info", "Неправильный логин или пароль");
		res.render('auth/login');	
		return;
      }

      var items = resultMatches.map(function (m) {
        return m.serialize();
      });
      var item = items[0];

      if(encrypt.compareSync(password, item.password)){
      	req.session.authenticated = 1;
      	req.session.user = item;

      	if(req.session.user.admin){      		
      		return res.redirect('admin');
      	}      	
      	res.redirect('tours');

      }else{
      	req.flash("info", "Неправильный логин или пароль");
		res.render('auth/login');	      	
      }
    });
  },
  displayRegistration: function (req, res, next) {
	if(req.session.authenticated === 1){
		return res.redirect('/');
	}
	res.render('auth/registration', {
	  	form: {sex: 1}
	});		
  },
  proceedRegistration: function (req, res, next) {
  	var item = 
	{
		user_name: req.body.user_name,
		password: req.body.password,
		first_name: req.body.first_name,
		second_name: req.body.second_name,
		height: req.body.height,
		sex: req.body.sex,
		age: req.body.age,
		about_myself: req.body.about_myself
	}

	req.models.user.create([item],
	function (err, resultMatches) {

		if (Array.isArray(err) && err[0].type === 'validation') {
			req.flash("info", err[0].msg);

			res.render('auth/registration', {
				form: item
			});
			return;
		}
		
		var items = resultMatches.map(function (m) {
        	return m.serialize();
      	});

      	req.flash("info", "Вы зарегистрировались, теперь вы можете войти под своим акаунтом");
      	res.redirect('login');	 
	});	
  },
  logout: function (req, res, next) {
	req.session.authenticated = 0;
	res.redirect('/');		
  },
  setTour: function (req, res, next) {  		
	req.models.user.get(req.session.user.id, function (err, item) {
		item.save({ tour_id: req.body.tour_id}, function (err) {
			if (Array.isArray(err) && err[0].type === 'validation') {
				req.flash("info", err[0].msg);
				res.redirect('tours');
				return;
			}

			req.session.user.tour_id = req.body.tour_id;
			req.flash("info", "Тур заказан!");
			res.redirect('tours');
		});
	});		
  },
  list: function(req, res, next){

  	var filter = 
	{
		approved: req.body.approved || 0
	}

  	if(req.body.tour_id){
		filter.tour_id = req.body.tour_id
  	}

  	new Promise(function(resolve, reject){

	  	if(req.body.button_approve && req.body.checked_users){

	  		req.models.user.find({ id: req.body.checked_users }).each(function (user) {
				user.approved = 1;			
			}).save(function (err) {				
				if(err){
					throw new Error(err);
				}
				resolve();
			});

	  	}else{
	  		resolve();
	  	}   		
  	})
	.then(function() {

		return new Promise((resolve, reject) => {
		    req.models.user.find(filter).limit().all(function (err, resultMatches){

		      if (err) throw new Error(err);

		      var users = resultMatches.map(function (m) {
		        return m.serialize();
		      });

	          resolve(users);

		    });
		});

	})
	.then(function(users){

		req.models.tour.find().order('-id').all(function (err, resultMatches) {
	      if (err) throw new Error(err);

	      var tours = resultMatches.map(function (m) {
	        return m.serialize();
	      });

	      //set index array as tour_id
	      var sorted_tours = [{short_name : 'Тур ещё не выбран'}];
	      for(index in tours){
	      	sorted_tours[tours[index].id] = tours[index];
	      }

	      res.render('admin/index', {
		  	users        : users,
		  	tours        : tours,
		  	sorted_tours : sorted_tours,
		  	tour_id      : filter.tour_id,
		  	approved     : filter.approved,
		  });
	    });

	})
	.catch(function(error){
		req.flash("info", "Ошибка базы данных!");
	    res.render('admin/index');		
	});

  }
  
 };

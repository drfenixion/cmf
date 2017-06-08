
var controllers = require('../app/controllers');
var auth = require('../libs/auth');

module.exports = function (app) {

	app.get( '/'                           , auth.visitor, controllers.home.teaser);
	app.get( '/login'                      , controllers.user.displayLogin);
	app.post( '/login'                     , controllers.user.proceedLogin);
	app.get( '/logout'                     , controllers.user.logout);	
	app.get( '/registration'               , controllers.user.displayRegistration);
	app.post( '/registration'              , controllers.user.proceedRegistration);
	app.get( '/tours'                      , auth.user, controllers.tour.list);
	app.post( '/tours'                     , auth.user, controllers.user.setTour);
	app.get( '/admin'                      , auth.admin, controllers.user.list);
	app.post( '/admin'                     , auth.admin, controllers.user.list);
};

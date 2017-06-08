
var controllers = require('../app/controllers');
var auth = require('../libs/auth');

module.exports = function (app) {

	app.get( '/'                           , auth.visitor, controllers.home.teaser);
	app.get( '/login'                      , controllers.auth.displayLogin);
	app.post( '/login'                     , controllers.auth.proceedLogin);
	app.get( '/logout'                     , controllers.auth.logout);	
	app.get( '/registration'               , controllers.auth.displayRegistration);
	app.post( '/registration'              , controllers.auth.proceedRegistration);
	app.get( '/tours'                      , auth.user, controllers.tour.list);
	app.post( '/tours'                     , auth.user, controllers.tour.setTour);
	app.get( '/admin'                      , auth.admin, controllers.admin.list);
	app.post( '/admin'                     , auth.admin, controllers.admin.list);
};

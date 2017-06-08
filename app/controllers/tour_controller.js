
module.exports = {
  list: function (req, res, next) {

    req.models.tour.find().order('-id').all(function (err, resultMatches) {
      if (err) return next(err);

      var items = resultMatches.map(function (m) {
        return m.serialize();
      });
      console.log('req.session.user', req.session.user);
      res.render('tours/index', {
	      tours          : items,
        user           : req.session.user,
        authenticated  : req.session.authenticated
	    });	  
    });
  },
};
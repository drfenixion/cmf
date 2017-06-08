
module.exports = {
  teaser: function (req, res, next) {

    req.models.tour.find(10).order('-id').all(function (err, resultMatches) {
      if (err) return next(err);

      var items = resultMatches.map(function (m) {
        return m.serialize();
      });
      
      res.render('home/index', {
	    tours          : items,
        user           : req.session.user,
        authenticated  : req.session.authenticated
	  });	  
    });
  },
};
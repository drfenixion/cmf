module.exports = {
    list: function(req, res, next) {

        req.models.tour.find().order('-id').all(function(err, resultMatches) {
            if (err) return next(err);

            var items = resultMatches.map(function(m) {
                return m.serialize();
            });
            
            res.render('tours/index', {
                tours: items,
                user: req.session.user,
                authenticated: req.session.authenticated
            });
        });
    },
    setTour: function(req, res, next) {
        req.models.user.get(req.session.user.id, function(err, item) {
            item.save({
                tour_id: req.body.tour_id
            }, function(err) {
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
};
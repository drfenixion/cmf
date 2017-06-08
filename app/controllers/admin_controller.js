module.exports = {
    list: function(req, res, next) {

        var filter = {
            approved: req.body.approved || 0
        }

        if (req.body.tour_id) {
            filter.tour_id = req.body.tour_id
        }

        new Promise(function(resolve, reject) {

                if (req.body.button_approve && req.body.checked_users) {

                    req.models.user.find({
                        id: req.body.checked_users
                    }).each(function(user) {
                        user.approved = 1;
                    }).save(function(err) {
                        if (err) {
                            throw new Error(err);
                        }
                        resolve();
                    });

                } else {
                    resolve();
                }
            })
            .then(function() {

                return new Promise((resolve, reject) => {
                    req.models.user.find(filter).limit().all(function(err, resultMatches) {

                        if (err) throw new Error(err);

                        var users = resultMatches.map(function(m) {
                            return m.serialize();
                        });

                        resolve(users);

                    });
                });

            })
            .then(function(users) {

                req.models.tour.find().order('-id').all(function(err, resultMatches) {
                    if (err) throw new Error(err);

                    var tours = resultMatches.map(function(m) {
                        return m.serialize();
                    });

                    //set index array as tour_id
                    var sorted_tours = [{
                        short_name: 'Тур ещё не выбран'
                    }];
                    for (index in tours) {
                        sorted_tours[tours[index].id] = tours[index];
                    }

                    res.render('admin/index', {
                        users: users,
                        tours: tours,
                        sorted_tours: sorted_tours,
                        tour_id: filter.tour_id,
                        approved: filter.approved,
                    });
                });

            })
            .catch(function(error) {
                req.flash("info", "Ошибка базы данных!");
                res.redirect('admin');
            });

    }
};
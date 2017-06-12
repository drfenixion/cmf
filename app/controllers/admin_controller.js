module.exports = {
    list: function(req, res, next) {

        var filter = {
            approved: req.body.approved || 0
        }

        if (req.body.tour_id) {
            filter.tour_id = req.body.tour_id
        }

        //get all session
        new Promise(function(resolve, reject) {

            req.sessionStore.all(function(err, sessions) {
                if (err) throw new Error(err);
                var sessionsSorted = [];
                for(index in sessions){
                    if(sessions[index].user){
                        sessionsSorted[sessions[index].user.id] = sessions[index];
                    }
                }
                resolve(sessionsSorted);
            });

        //update users in db and session
        }).then(function(sessionsSorted) {         

            return new Promise((resolve, reject) => {
                if (req.body.button_approve && req.body.checked_users) {

                    req.models.user.find({
                        id: req.body.checked_users
                    }).each(function(user) {

                        //update sessions
                        if(sessionsSorted[user.id]){
                            sessionsSorted[user.id].user.approved = 1;

                            req.sessionStore.set(sessionsSorted[user.id].id, sessionsSorted[user.id],
                                function(err){
                                    if (err) throw new Error(err);
                                }
                            );
                        }

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
            });
        })
        //get all users
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
        //find all tour and render admin
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
            console.error('Error: ', error);
            res.status(500).send('Error!'); 
        });

    }
};
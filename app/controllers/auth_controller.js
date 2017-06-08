var encrypt = require('../../libs/encrypt');

module.exports = {
    displayLogin: function(req, res, next) {
        if (req.session.authenticated === 1) {
            return res.redirect('/');
        }
        res.render('auth/login');
    },
    proceedLogin: function(req, res, next) {

        var user_name = req.body.user_name;
        var password = req.body.password;

        req.models.user.find({
                user_name: user_name
            }).limit(1)
            .all(function(err, resultMatches) {

                if (err) return next(err);

                if (resultMatches[0] == undefined) {
                    req.flash("info", "Неправильный логин или пароль");
                    res.render('auth/login');
                    return;
                }

                var items = resultMatches.map(function(m) {
                    return m.serialize();
                });
                var item = items[0];

                if (encrypt.compareSync(password, item.password)) {
                    req.session.authenticated = 1;
                    console.log('item', item);
                    req.session.user = item;
                    console.log('req.session.user', req.session.user);

                    if (req.session.user.admin) {
                        return res.redirect('admin');
                    }
                    res.redirect('tours');

                } else {
                    req.flash("info", "Неправильный логин или пароль");
                    res.render('auth/login');
                }
            });
    },
    displayRegistration: function(req, res, next) {
        if (req.session.authenticated === 1) {
            return res.redirect('/');
        }
        res.render('auth/registration', {
            form: {
                sex: 1
            }
        });
    },
    proceedRegistration: function(req, res, next) {
        var item = {
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
            function(err, resultMatches) {

                if (Array.isArray(err) && err[0].type === 'validation') {
                    req.flash("info", err[0].msg);

                    res.render('auth/registration', {
                        form: item
                    });
                    return;
                }

                var items = resultMatches.map(function(m) {
                    return m.serialize();
                });

                req.flash("info", "Вы зарегистрировались, теперь вы можете войти под своим акаунтом");
                res.redirect('login');
            });
    },
    logout: function(req, res, next) {
        req.session.authenticated = 0;
        req.session.user = null;
        console.log('logout req.session.user', req.session.user);
        res.redirect('/');
    }
};
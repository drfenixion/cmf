var path = require('path');
var express = require('express');
var settings = require('./settings');
var models = require('../app/models/');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var cookieParser = require('cookie-parser')

module.exports = function(app) {
    app.configure(function() {
        app.use(express.static(path.join(settings.path, 'public')));
        app.use(express.logger({
            format: 'dev'
        }));
        app.use(express.bodyParser());

        app.use(cookieParser());
        app.use(session({
            secret: 'fsgsjgb44jf',
            key: 'session_id',
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: new Date(Date.now() + 3600000)
            },

            store: new SessionStore({
                host: settings.database.host,
                user: settings.database.user,
                password: settings.database.password,
                database: settings.database.database
            }),
            unset: 'destroy'

        }));

        app.use(require('connect-flash')());
        app.use(function(req, res, next) {
            res.locals.messages = require('express-messages')(req, res);
            next();
        });

        app.use(express.methodOverride());

        app.use(function(req, res, next) {
                models(function(err, db) {
                    if (err) return next(err);

                    req.models = db.models;
                    req.db = db;

                    return next();
                });
            }),

            app.use(app.router);

        app.set('view engine', 'pug');
        app.set('views', __dirname + '/../app/views');

    });
};
const app = require('express')();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const raven = require('raven');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config.js');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const logger = require('./log.js');
const bcrypt = require('bcrypt');
const api = require('./api');
// const webpack = require('webpack');
// const webpackMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const webpackConfig = require('../webpack.config.js');
const express = require('express');
const path = require('path');
// const pug = require('pug');
const jwt = require('jsonwebtoken');
const http = require('http');


const UserRepository = require('./repositories/userRepository.js');

class Server {
    constructor(isDeveloping) {
        this.userRepository = new UserRepository();
        this.isDeveloping = isDeveloping;
        this.server = http.Server(app);
    }

    init() {
        if(!this.isDeveloping) {
            raven.config(config.sentryDsn);

            app.use(raven.requestHandler());
            app.use(raven.errorHandler());
        }

        app.use(session({
            store: new MongoStore({ url: config.dbPath }),
            saveUninitialized: false,
            resave: false,
            secret: config.secret,
            cookie: { maxAge: config.cookieLifetime } // 7 days
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new localStrategy(this.verifyUser.bind(this)));
        passport.serializeUser(this.serializeUser.bind(this));
        passport.deserializeUser(this.deserializeUser.bind(this));

        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app);

        if(this.isDeveloping) {
            // const compiler = webpack(webpackConfig);
            // const middleware = webpackMiddleware(compiler, {
            //     hot: true,
            //     contentBase: 'client',
            //     publicPath: webpackConfig.output.publicPath,
            //     stats: {
            //         colors: true,
            //         hash: false,
            //         timings: true,
            //         chunks: false,
            //         chunkModules: false,
            //         modules: false
            //     },
            //     historyApiFallback: true
            // });

            // app.use(middleware);
            // app.use(express.static(__dirname + '/../public'));
            // app.get('*', function response(req, res) {
            //     var token = undefined;

            //     if(req.user) {
            //         token = jwt.sign(req.user, config.secret);
            //     }

            //     var html = pug.renderFile('views/index.pug', { basedir: path.join(__dirname, '..', 'views'), user: req.user, token: token });
            //     middleware.fileSystem.writeFileSync(path.join(__dirname, '..', 'public/index.html'), html);
            //     res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'public/index.html')));
            //     res.end();
            // });
            app.use(express.static(__dirname + '/../public'));
            app.set('view engine', 'pug');
            app.set('views', path.join(__dirname, '..', 'views'));
            app.get('*', function response(req, res) {
                var token = undefined;

                if(req.user) {
                    token = jwt.sign(req.user, config.secret);
                }

                res.render('index', { basedir: path.join(__dirname, '..', 'views'), user: req.user, token: token });
            });
        } else {
            app.use(express.static(__dirname + '/../public'));
            app.set('view engine', 'pug');
            app.set('views', path.join(__dirname, '..', 'views'));
            app.get('*', function response(req, res) {
                var token = undefined;

                if(req.user) {
                    token = jwt.sign(req.user, config.secret);
                }

                res.render('index', { basedir: path.join(__dirname, '..', 'views'), user: req.user, token: token, production: true });
            });
        }

        return this.server;
    }

    run() {
        var port = this.isDeveloping ? 4000 : process.env.PORT;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if(err) {
                logger.error(err);
            }

            logger.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    verifyUser(username, password, done) {
        this.userRepository.getUserByUsername(username).then(user => {
            if(!user) {
                return done(null, false, { message: 'Invalid username/password' });
            }

            bcrypt.compare(password, user.password, function(err, valid) {
                if(err) {
                    return done(err);
                }

                if(!valid) {
                    return done(null, false, { message: 'Invalid username/password' });
                }

                return done(null, { username: user.username, email: user.email, emailHash: user.emailHash, _id: user._id });
            });
        }).catch(err => {
            logger.info(err.message);

            return done(err);
        });
    }

    serializeUser(user, done) {
        if(user) {
            done(null, user._id);
        }
    }

    deserializeUser(id, done) {
        this.userRepository.getUserById(id).then(user => {
            if(!user) {
                return;
            }

            done(null, { username: user.username, email: user.email, emailHash: user.emailHash, _id: user._id });
        }).catch(err => {
            logger.info(err);
        });
    }
}

module.exports = Server;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.js');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const logger = require('./log.js');
const bcrypt = require('bcrypt');
const api = require('./api');
const path = require('path');
const jwt = require('jsonwebtoken');
const http = require('http');
const Raven = require('raven');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js')();
const monk = require('monk');
const _ = require('underscore');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserService = require('./services/UserService.js');
const version = require('../version.js');
const Settings = require('./settings.js');

class Server {
    constructor(isDeveloping) {
        let db = monk(config.dbPath);
        this.userService = new UserService(db);
        this.isDeveloping = isDeveloping;
        this.server = http.Server(app);

        this.vendorAssets = require('../vendor-assets.json');
        if(!this.isDeveloping) {
            this.assets = require('../assets.json');
        }
    }

    init() {
        if(!this.isDeveloping) {
            Raven.config(config.sentryDsn, { release: version }).install();

            app.use(Raven.requestHandler());
            app.use(Raven.errorHandler());
        }

        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = config.secret;

        console.info(opts);

        passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
            console.info(jwtPayload);
            this.userService.getUserById(jwtPayload.id).then(user => {
                if(user) {
                    return done(null, user);
                }

                return done(null, false);
            }).catch(err => {
                return done(err, false);
            });
        }));
        app.use(passport.initialize());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app);

        app.use(express.static(__dirname + '/../public'));
        app.set('view engine', 'pug');
        app.set('views', path.join(__dirname, '..', 'views'));

        if(this.isDeveloping) {
            const compiler = webpack(webpackConfig);
            const middleware = webpackDevMiddleware(compiler, {
                hot: true,
                contentBase: 'client',
                publicPath: webpackConfig.output.publicPath,
                stats: {
                    colors: true,
                    hash: false,
                    timings: true,
                    chunks: false,
                    chunkModules: false,
                    modules: false
                },
                historyApiFallback: true
            });

            app.use(middleware);
            app.use(webpackHotMiddleware(compiler, {
                log: false,
                path: '/__webpack_hmr',
                heartbeat: 2000
            }));
        }

        app.get('*', (req, res) => {
            res.render('index', {
                basedir: path.join(__dirname, '..', 'views'), user: Settings.getUserWithDefaultsSet(req.user),
                vendorAssets: this.vendorAssets, assets: this.assets
            });
        });

        // Define error middleware last
        app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
            if(!res.headersSent) {
                res.status(500).send({ success: false });
            }

            logger.error(err);
        });

        return this.server;
    }

    run() {
        let port = process.env.PORT || config.port || 4000;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if(err) {
                logger.error(err);
            }

            logger.info('==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    serializeUser(user, done) {
        if(user) {
            done(null, user._id);
        }
    }
}

module.exports = Server;

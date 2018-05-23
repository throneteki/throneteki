const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.js');
const passport = require('passport');
const logger = require('./log.js');
const api = require('./api');
const path = require('path');
const http = require('http');
const Raven = require('raven');
const monk = require('monk');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const UserService = require('./services/UserService.js');
const version = require('../version.js');

class Server {
    constructor(isDeveloping) {
        let db = monk(config.dbPath);
        this.userService = new UserService(db);
        this.isDeveloping = isDeveloping;
        this.server = http.Server(app);

        if(!this.isDeveloping) {
            this.vendorAssets = require('../vendor-assets.json');
            this.assets = require('../assets.json');
        } else {
            this.vendorAssets = undefined;
            this.assets = { bundle: { js: '/bundle.js' } };
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

        passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
            this.userService.getUserById(jwtPayload._id).then(user => {
                if(user) {
                    return done(null, user.getWireSafeDetails());
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

        app.get('*', (req, res) => {
            res.render('index', {
                basedir: path.join(__dirname, '..', 'views'),
                vendorAssets: this.vendorAssets, assets: this.assets
            });
        });

        // Define error middleware last
        app.use(function(err, req, res, next) {
            logger.error(err);

            if(!res.headersSent && req.xhr) {
                return res.status(500).send({ success: false });
            }

            next(err);
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

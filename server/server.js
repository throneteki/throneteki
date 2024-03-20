const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('./log.js');
const api = require('./api');
const path = require('path');
const http = require('http');
const Sentry = require('@sentry/node');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const ServiceFactory = require('./services/ServiceFactory.js');

class Server {
    constructor(isDeveloping) {
        this.isDeveloping = isDeveloping;
        this.configService = ServiceFactory.configService();
    }

    init(options) {
        this.userService = ServiceFactory.userService(options.db, this.configService);
        this.server = http.Server(app);

        if (!this.isDeveloping) {
            Sentry.init({
                dsn: this.configService.getValue('sentryDsn'),
                release: process.env.VERSION || 'Local build'
            });
            app.use(Sentry.Handlers.requestHandler());
            app.use(Sentry.Handlers.errorHandler());
        }

        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = this.configService.getValue('secret');

        passport.use(
            new JwtStrategy(opts, (jwtPayload, done) => {
                this.userService
                    .getUserById(jwtPayload._id)
                    .then((user) => {
                        if (user) {
                            return done(null, user.getWireSafeDetails());
                        }

                        return done(null, false);
                    })
                    .catch((err) => {
                        return done(err, false);
                    });
            })
        );
        app.use(passport.initialize());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app, options);

        app.use(express.static(__dirname + '/../public'));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
        });

        // Define error middleware last
        app.use(function (err, req, res, next) {
            logger.error(err);

            if (!res.headersSent && req.xhr) {
                return res.status(500).send({ success: false });
            }

            next(err);
        });

        return this.server;
    }

    run() {
        let port = process.env.PORT || this.configService.getValue('port') || 4000;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if (err) {
                logger.error(err);
            }

            logger.info(
                '==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.',
                port,
                port
            );
        });
    }

    serializeUser(user, done) {
        if (user) {
            done(null, user._id);
        }
    }
}

module.exports = Server;

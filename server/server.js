import express from 'express';
import ViteExpress from 'vite-express';
const app = express();
import bodyParser from 'body-parser';
import passport from 'passport';
import logger from './log.js';
import { init as ApiInit } from './api/index.js';
import http from 'http';
import Sentry from '@sentry/node';
import passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

import ServiceFactory from './services/ServiceFactory.js';

const __dirname = import.meta.dirname;

class Server {
    constructor(isDeveloping) {
        this.isDeveloping = isDeveloping;
        this.configService = ServiceFactory.configService();
    }

    async init(options) {
        this.userService = ServiceFactory.userService(options.db, this.configService);
        this.server = http.Server(app);

        if (!this.isDeveloping) {
            Sentry.init({
                dsn: this.configService.getValue('sentryDsn'),
                release: process.env.VERSION || 'Local build',
                includeLocalVariables: true
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

        await ApiInit(app, options);

        app.use(express.static(__dirname + '/../public'));
        app.use(express.static(__dirname + '/../dist'));

        // app.get('*', (req, res) => {
        //     res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
        // });

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

        ViteExpress.bind(app, this.server);

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

export default Server;

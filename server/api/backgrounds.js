import bodyParser from 'body-parser';
import passport from 'passport';
import ServiceFactory from '../services/ServiceFactory.js';
import { readImageInfo } from '../imageInfo.js';
import { backgroundUploadLimiter } from '../rateLimits.js';
import { wrapAsync } from '../util.js';
import {
    BackgroundImageTypes,
    MaxBackgroundBytes,
    MaxBackgroundDimension
} from '../../shared/backgrounds.js';

const TokenPattern = /^[a-f0-9]{32}$/;

const readImageBody = bodyParser.raw({ type: BackgroundImageTypes, limit: MaxBackgroundBytes });

export const init = function (server) {
    const userService = ServiceFactory.userService(ServiceFactory.configService());

    const findOwnUser = async (req, res) => {
        if (!req.user || req.user.username !== req.params.username) {
            res.status(403).send({ success: false, message: 'Forbidden' });
            return undefined;
        }

        const user = await userService.getUserByUsername(req.params.username);
        if (!user) {
            res.status(401).send({ success: false, message: 'Unauthorized' });
            return undefined;
        }

        return user;
    };

    server.put(
        '/api/account/:username/background',
        passport.authenticate('jwt', { session: false }),
        backgroundUploadLimiter,
        readImageBody,
        wrapAsync(async (req, res) => {
            const user = await findOwnUser(req, res);
            if (!user) {
                return;
            }

            const info = readImageInfo(req.body);
            if (!info) {
                return res.status(400).send({
                    success: false,
                    message: 'Backgrounds must be a PNG, JPEG or WebP image'
                });
            }

            if (info.width > MaxBackgroundDimension || info.height > MaxBackgroundDimension) {
                return res.status(400).send({
                    success: false,
                    message: `Backgrounds can be at most ${MaxBackgroundDimension} pixels wide or high`
                });
            }

            const token = await userService.setCustomBackground(user.username, {
                contentType: info.type,
                image: req.body
            });
            user.setCustomBackground(token);

            res.send({ success: true, data: { user: user.getWireSafeDetails() } });
        })
    );

    server.delete(
        '/api/account/:username/background',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            const user = await findOwnUser(req, res);
            if (!user) {
                return;
            }

            await userService.removeCustomBackground(user.username);
            user.setCustomBackground(undefined);

            res.send({ success: true, data: { user: user.getWireSafeDetails() } });
        })
    );

    // Public so the board can use it as a CSS background, which can't send credentials. Each upload gets a new
    // random token, so the response never changes and can be cached for good.
    server.get(
        '/api/backgrounds/:token',
        wrapAsync(async (req, res) => {
            const background = TokenPattern.test(req.params.token)
                ? await userService.getCustomBackground(req.params.token)
                : undefined;

            if (!background) {
                return res.status(404).send({ success: false, message: 'Not found' });
            }

            res.set({
                'Content-Type': background.contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'X-Content-Type-Options': 'nosniff',
                'Content-Security-Policy': "default-src 'none'"
            });
            res.send(background.image);
        })
    );
};

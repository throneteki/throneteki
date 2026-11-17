import passport from 'passport';
import ServiceFactory from '../services/ServiceFactory.js';
import logger from '../log.js';
import { readImageInfo } from '../imageInfo.js';
import { bannerUploadLimiter } from '../rateLimits.js';
import { wrapAsync } from '../util.js';
import { ImageTokenPattern, readImageBody, sendStoredImage } from '../storedImages.js';
import {
    BannerHeight,
    BannerWidth,
    MaxBannerBytes,
    MaxBannerTitleLength,
    MaxBannerUrlLength
} from '../../shared/banners.js';

const IdPattern = /^\d{1,18}$/;
const DatePattern = /^\d{4}-\d{2}-\d{2}$/;
const TimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const ForeignKeyViolation = '23503';

function readDate(value) {
    if (typeof value !== 'string' || !DatePattern.test(value)) {
        return undefined;
    }

    const date = new Date(`${value}T00:00:00Z`);

    return !isNaN(date) && date.toISOString().startsWith(value) ? value : undefined;
}

function readTimestamp(value) {
    if (typeof value !== 'string' || !TimestampPattern.test(value)) {
        return undefined;
    }

    const date = new Date(value);

    return isNaN(date) ? undefined : date;
}

function readLink(value) {
    let url;
    try {
        url = new URL(value);
    } catch {
        return undefined;
    }

    return url.protocol === 'https:' && url.href.length <= MaxBannerUrlLength
        ? url.href
        : undefined;
}

export function parseBanner(body = {}) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title || title.length > MaxBannerTitleLength) {
        return { error: `Banners need a title of at most ${MaxBannerTitleLength} characters` };
    }

    let linkUrl = null;
    if (typeof body.linkUrl === 'string' && body.linkUrl.trim()) {
        linkUrl = readLink(body.linkUrl.trim());
        if (!linkUrl) {
            return {
                error: `The link must be an https address of at most ${MaxBannerUrlLength} characters`
            };
        }
    }

    let eventId = null;
    if (body.eventId !== undefined && body.eventId !== null && body.eventId !== '') {
        if (!IdPattern.test(String(body.eventId))) {
            return { error: 'That event does not exist' };
        }

        eventId = String(body.eventId);
    }

    if (linkUrl && eventId) {
        return { error: 'Banners can open a link or start a game for an event, not both' };
    }

    let eventDate = null;
    if (body.eventDate) {
        eventDate = readDate(body.eventDate);
        if (!eventDate) {
            return { error: 'The event date is not a valid date' };
        }
    }

    const showFrom = readTimestamp(body.showFrom);
    const showUntil = readTimestamp(body.showUntil);
    if (!showFrom || !showUntil) {
        return { error: 'Banners need a date to start and stop showing' };
    }

    if (showUntil <= showFrom) {
        return { error: 'Banners must stop showing after they start' };
    }

    return { banner: { title, linkUrl, eventId, eventDate, showFrom, showUntil } };
}

const authenticate = passport.authenticate('jwt', { session: false });

function requireBannerManager(req, res, next) {
    if (!req.user.permissions?.canManageBanners) {
        return res.status(403).send({ success: false, message: 'Forbidden' });
    }

    next();
}

function requireBannerId(req, res, next) {
    if (!IdPattern.test(req.params.id)) {
        return res.status(404).send({ success: false, message: 'Banner not found' });
    }

    next();
}

export const init = function (server) {
    const bannerService = ServiceFactory.bannerService();

    const saveBanner = async (req, res, save) => {
        const { banner, error } = parseBanner(req.body);
        if (error) {
            return res.status(400).send({ success: false, message: error });
        }

        try {
            const saved = await save(banner);
            if (!saved) {
                return res.status(404).send({ success: false, message: 'Banner not found' });
            }

            res.send({ success: true, data: saved });
        } catch (err) {
            if (err.code === ForeignKeyViolation) {
                return res
                    .status(400)
                    .send({ success: false, message: 'That event does not exist' });
            }

            logger.error('Error saving banner %s', err);
            res.status(500).send({
                success: false,
                message: 'An error occurred saving the banner'
            });
        }
    };

    server.get(
        '/api/banners',
        wrapAsync(async (req, res) => {
            res.send({ success: true, data: await bannerService.getCachedActiveBanners() });
        })
    );

    server.get(
        '/api/banners/all',
        authenticate,
        requireBannerManager,
        wrapAsync(async (req, res) => {
            res.send({ success: true, data: await bannerService.getBanners() });
        })
    );

    server.post(
        '/api/banners',
        authenticate,
        requireBannerManager,
        wrapAsync(async (req, res) => {
            await saveBanner(req, res, (banner) =>
                bannerService.addBanner(banner, req.user.username)
            );
        })
    );

    server.put(
        '/api/banners/:id',
        authenticate,
        requireBannerManager,
        requireBannerId,
        wrapAsync(async (req, res) => {
            await saveBanner(req, res, (banner) =>
                bannerService.updateBanner(req.params.id, banner)
            );
        })
    );

    server.delete(
        '/api/banners/:id',
        authenticate,
        requireBannerManager,
        requireBannerId,
        wrapAsync(async (req, res) => {
            if (!(await bannerService.deleteBanner(req.params.id))) {
                return res.status(404).send({ success: false, message: 'Banner not found' });
            }

            res.send({ success: true, data: { _id: req.params.id } });
        })
    );

    server.put(
        '/api/banners/:id/image',
        authenticate,
        requireBannerManager,
        requireBannerId,
        bannerUploadLimiter,
        readImageBody(MaxBannerBytes),
        wrapAsync(async (req, res) => {
            const info = readImageInfo(req.body);
            if (!info) {
                return res.status(400).send({
                    success: false,
                    message: 'Banner images must be a PNG, JPEG or WebP image'
                });
            }

            if (info.width !== BannerWidth || info.height !== BannerHeight) {
                return res.status(400).send({
                    success: false,
                    message: `Banner images must be ${BannerWidth} by ${BannerHeight} pixels`
                });
            }

            const banner = await bannerService.setImage(req.params.id, {
                contentType: info.type,
                image: req.body
            });
            if (!banner) {
                return res.status(404).send({ success: false, message: 'Banner not found' });
            }

            res.send({ success: true, data: banner });
        })
    );

    server.get(
        '/api/banners/images/:token',
        wrapAsync(async (req, res) => {
            const image = ImageTokenPattern.test(req.params.token)
                ? await bannerService.getImage(req.params.token)
                : undefined;

            sendStoredImage(res, image);
        })
    );
};

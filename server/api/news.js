import passport from 'passport';
import NewsService from '../services/NewsService.js';
import logger from '../log.js';
import { wrapAsync } from '../util.js';

export const init = function (server, options) {
    let newsService = new NewsService(options.db);

    server.get('/api/news', function (req, res) {
        newsService
            .getRecentNewsItems({ limit: req.query.limit })
            .then((news) => {
                res.send({ success: true, data: news });
            })
            .catch((err) => {
                logger.error(err);

                res.send({ success: false, message: 'Error loading news' });
            });
    });

    server.post(
        '/api/news',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canEditNews) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            let newsItem = await newsService.addNews({
                poster: req.user.username,
                text: req.body.text,
                datePublished: new Date()
            });
            res.send({ success: true, data: newsItem });
        })
    );

    server.put(
        '/api/news/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canEditNews) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            await newsService.editNews(req.params.id, req.body.text);
            res.send({ success: true, data: { id: req.params.id, text: req.body.text } });
        })
    );

    server.delete(
        '/api/news/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canEditNews) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            await newsService.deleteNews(req.params.id);

            res.send({
                success: true,
                message: 'News item deleted successfully',
                id: req.params.id
            });
        })
    );
};

import passport from 'passport';

import UserStatsService from '../services/UserStatsService.js';
import WrappedService from '../services/WrappedService.js';
import { wrapAsync } from '../util.js';

export const init = function (server) {
    const userStatsService = new UserStatsService();
    const wrappedService = new WrappedService();

    server.get(
        '/api/stats/monthly',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const userId = req.user._id;
            const months = await userStatsService.getMonths(userId);
            // Without a month, show the latest one with games
            const month = req.query.month === undefined ? months[0] : req.query.month;

            if (!month) {
                return res.send({ success: true, data: { months: [], month: null, stats: null } });
            }

            // Only months with games, so nobody can make the server work out (and cache) arbitrary months
            if (!months.includes(month)) {
                return res.status(400).send({ success: false, message: 'Invalid month' });
            }

            const stats = await userStatsService.getMonth(userId, month);

            res.send({ success: true, data: { months, month, stats } });
        })
    );

    server.get(
        '/api/wrapped/:year',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const result = await wrappedService.getForUser(req.user._id, req.params.year);

            if (!result) {
                return res
                    .status(404)
                    .send({ success: false, message: 'No page in the White Book for this year' });
            }

            if (result.expired) {
                return res
                    .status(410)
                    .send({ success: false, message: 'This White Book is no longer available' });
            }

            res.send({ success: true, data: { wrapped: result.wrapped } });
        })
    );
};

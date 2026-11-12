import passport from 'passport';
import qs from 'qs';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';

const UuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function canViewProblemReports(user) {
    return !!user.permissions?.canViewProblemReports;
}

export const init = function (server) {
    const problemReportService = ServiceFactory.problemReportService();

    server.get(
        '/api/problem-reports',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!canViewProblemReports(req.user)) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const options = qs.parse(decodeURIComponent(req._parsedUrl.query || ''), {
                allowDots: true,
                comma: true
            });

            return res.send(await problemReportService.list(options));
        })
    );

    server.get(
        '/api/problem-reports/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!canViewProblemReports(req.user)) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const report = UuidPattern.test(req.params.id)
                ? await problemReportService.getById(req.params.id)
                : undefined;

            if (!report) {
                return res
                    .status(404)
                    .send({ success: false, message: 'Problem report not found or expired' });
            }

            return res.send({ success: true, data: report });
        })
    );
};

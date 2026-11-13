import passport from 'passport';
import qs from 'qs';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';
import { MaxDeleteCount } from '../../shared/problemReportLimits.js';

const UuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function canManageProblemReports(user) {
    return !!user.permissions?.canManageProblemReports;
}

// qs decodes each key and value itself, so search text keeps its commas and ampersands.
export function parseListQuery(rawQuery) {
    return qs.parse(rawQuery || '', { allowDots: true });
}

export const init = function (server) {
    const problemReportService = ServiceFactory.problemReportService();

    server.get(
        '/api/problem-reports',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!canManageProblemReports(req.user)) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            return res.send(await problemReportService.list(parseListQuery(req._parsedUrl.query)));
        })
    );

    server.get(
        '/api/problem-reports/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!canManageProblemReports(req.user)) {
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

    server.delete(
        '/api/problem-reports',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!canManageProblemReports(req.user)) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const ids = req.body?.ids;
            if (
                !Array.isArray(ids) ||
                ids.length === 0 ||
                ids.length > MaxDeleteCount ||
                !ids.every((id) => typeof id === 'string' && UuidPattern.test(id))
            ) {
                return res.status(400).send({
                    success: false,
                    message: `Choose up to ${MaxDeleteCount} reports to delete`
                });
            }

            const deleted = await problemReportService.delete(ids);

            return res.send({ success: true, data: { ids: deleted } });
        })
    );
};

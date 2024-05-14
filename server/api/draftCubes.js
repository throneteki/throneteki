import passport from 'passport';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';

function validate(draftCube) {
    let errors = [];

    if (!draftCube.name) {
        errors.push('name is required');
    }

    if (!draftCube.packDefinitions || !Array.isArray(draftCube.packDefinitions)) {
        errors.push('packDefinitions is required');
    } else {
        for (const packDefinition of draftCube.packDefinitions) {
            errors = errors.concat(validatePackDefinition(packDefinition));
        }
    }

    return errors;
}

function validatePackDefinition(packDefinition) {
    const errors = [];

    if (!packDefinition.rarities || !Array.isArray(packDefinition.rarities)) {
        errors.push('rarities is required');
    } else if (
        packDefinition.rarities.some(
            (rarity) => !rarity.name || !rarity.numPerPack || !rarity.cards
        )
    ) {
        errors.push('rarities must include name, numPerPack, and cards');
    }

    return errors;
}

export const init = function (server, options) {
    const draftCubesService = ServiceFactory.draftCubeService(options.db);

    server.get(
        '/api/draft-cubes',
        wrapAsync(async function (req, res) {
            const draftCubes = await draftCubesService.getAll();

            return res.send({ success: true, draftCubes });
        })
    );

    server.post(
        '/api/draft-cubes',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res, next) {
            if (!req.user.permissions || !req.user.permissions.canManageEvents) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const { name, packDefinitions, starterDeck } = req.body.draftCube;
            const draftCube = { name, packDefinitions, starterDeck };

            const errors = validate(draftCube);
            if (errors.length !== 0) {
                res.send({ success: false, message: errors.join('\n') });
                return next();
            }

            draftCubesService
                .create(draftCube)
                .then((draftCube) => {
                    res.send({ success: true, draftCube });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured adding the draft cube'
                    });
                });
        })
    );

    server.put(
        '/api/draft-cubes/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res, next) {
            if (!req.user.permissions || !req.user.permissions.canManageEvents) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const { name, packDefinitions, starterDeck } = req.body.draftCube;
            const draftCube = {
                id: req.params.id,
                name,
                packDefinitions,
                starterDeck
            };

            const errors = validate(draftCube);
            if (errors.length !== 0) {
                res.send({ success: false, message: errors.join('\n') });
                return next();
            }

            draftCubesService
                .update(draftCube)
                .then((draftCube) => {
                    res.send({ success: true, draftCube });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured adding the draft cube'
                    });
                });
        })
    );

    server.delete(
        '/api/draft-cubes/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageEvents) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const draftCubeId = req.params.id;

            draftCubesService
                .delete(draftCubeId)
                .then(() => {
                    res.send({ success: true, draftCubeId });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured deleting the draft cube'
                    });
                });
        })
    );
};

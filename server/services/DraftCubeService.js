import logger from '../log.js';

class DraftCubeService {
    constructor(db) {
        this.draftCubes = db.get('draftCubes');
    }

    async getAll() {
        return this.draftCubes
            .find({})
            .then((draftCube) => {
                return draftCube;
            })
            .catch((err) => {
                logger.error('Error fetching draft cubes %s', err);

                throw new Error('Error occured fetching draft cubes');
            });
    }

    async getById(id) {
        return this.draftCubes.findOne({ _id: id }).catch((err) => {
            logger.error('Unable to fetch draft cube %s', err);
            throw new Error('Unable to fetch draft cube ' + id);
        });
    }

    async create(draftCube) {
        let properties = {
            name: draftCube.name,
            packDefinitions: draftCube.packDefinitions,
            starterDeck: draftCube.starterDeck,
            lastUpdated: new Date()
        };

        return this.draftCubes.insert(properties);
    }

    async update(draftCube) {
        let properties = {
            name: draftCube.name,
            packDefinitions: draftCube.packDefinitions,
            starterDeck: draftCube.starterDeck,
            lastUpdated: new Date()
        };

        return this.draftCubes.update({ _id: draftCube.id }, { $set: properties });
    }

    async delete(id) {
        return this.draftCubes.remove({ _id: id });
    }
}

export default DraftCubeService;

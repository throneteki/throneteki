import logger from '../log.js';

class BanlistService {
    constructor(db) {
        this.banlist = db.get('banlist');
    }

    async getBanList() {
        return this.banlist
            .find({})
            .then((banlist) => {
                return banlist;
            })
            .catch((err) => {
                logger.error('Error fetching banlist %s', err);

                throw new Error('Error occured fetching banlist');
            });
    }

    async getEntryByIp(ip) {
        return this.banlist
            .find({ ip: ip })
            .then((banlist) => {
                return banlist[0];
            })
            .catch((err) => {
                logger.error('Error fetching banlist %s', err);

                throw new Error('Error occured fetching banlist');
            });
    }

    async addBanlistEntry(entry) {
        return this.banlist
            .insert(entry)
            .then(() => {
                return entry;
            })
            .catch((err) => {
                logger.error('Error adding banlist entry %s %s', err, entry);

                throw new Error('Error occured adding banlist entry');
            });
    }

    async removeBanlistEntry(id) {
        return this.banlist.remove({ _id: id }).catch((err) => {
            logger.error('Error removing banlist entry %s %s', err, id);

            throw new Error('Error occured removing banlist entry');
        });
    }
}

export default BanlistService;

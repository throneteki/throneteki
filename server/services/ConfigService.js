const config = require('../config');
const logger = require('../log');

class ConfigService {
    constructor() {
        this.config = config;
    }

    getValue(key) {
        if(!this.config[key]) {
            logger.warn(`Requested config key ${key} which does is not configured`);

            return undefined;
        }

        return this.config[key];
    }
}

module.exports = ConfigService;

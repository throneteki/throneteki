const config = require('config');
const logger = require('../log.js');

class ConfigService {
    getValue(key) {
        if(!config[key]) {
            logger.warn(`Asked for config value '${key}', but it was not configured`);
        }

        return config[key];
    }
}

module.exports = ConfigService;

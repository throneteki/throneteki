import config from 'config';
import logger from '../log.js';

class ConfigService {
    getValue(key) {
        if (!config[key]) {
            logger.warn(`Asked for config value '${key}', but it was not configured`);
        }

        return config[key];
    }
}

export default ConfigService;

import logger from './log.js';

// The placeholder values shipped in config/default.json5
const InsecureDefaults = {
    secret: 'somethingverysecret',
    hmacSecret: 'somethingevenmoresecret'
};

/**
 * Refuses to start a production process whose signing secrets are missing or still set to the
 * shipped defaults, since anyone could then forge auth tokens. Outside production it only warns.
 */
export function checkSecrets(configService, keys = Object.keys(InsecureDefaults)) {
    const problems = keys
        .filter((key) => {
            const value = configService.getValue(key);

            return !value || value === InsecureDefaults[key];
        })
        .map((key) => `'${key}' is not set or is using the default value`);

    if (problems.length === 0) {
        return;
    }

    if (process.env.NODE_ENV === 'production' || configService.getValue('env') === 'production') {
        for (const problem of problems) {
            logger.error(`Insecure configuration: ${problem}`);
        }

        throw new Error('Refusing to start with insecure secrets in production');
    }

    for (const problem of problems) {
        logger.warn(`Insecure configuration: ${problem}. Do not use this config in production`);
    }
}

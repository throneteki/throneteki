import { promisify } from 'util';
import config from 'config';
import redis from 'redis';
import logger from '../log.js';
import disposableEmailDomains from '../data/disposableEmailDomains.js';

const EmailRiskVerdict = Object.freeze({
    Allow: 'allow',
    Deny: 'deny',
    Unknown: 'unknown'
});

class DisposableEmailService {
    constructor(configService) {
        this.configService = configService;
        this.keyPrefix = configService.getValue('redisKeyPrefix');
        this.knownVerdictTtlSeconds =
            configService.getValue('disposableEmailCacheTtlSeconds') || 60 * 60 * 24 * 180;
        this.unknownVerdictTtlSeconds =
            configService.getValue('disposableEmailUnknownCacheTtlSeconds') || 60 * 15;

        this.redis = redis.createClient(configService.getValue('redisUrl'));
        this.redis.on('error', this.onRedisError);

        this.getAsync = promisify(this.redis.get).bind(this.redis);
        this.setexAsync = promisify(this.redis.setex).bind(this.redis);
    }

    async evaluateRegistrationEmail(email) {
        let domain = this.normalizeEmailDomain(email);
        let localVerdict = this.getLocalDisposableEmailVerdict(domain);
        if (localVerdict.verdict === EmailRiskVerdict.Deny) {
            return {
                domain,
                verdict: localVerdict.verdict,
                source: localVerdict.source
            };
        }

        let externalVerdict = await this.getDisposableEmailServiceVerdict(domain);

        return {
            domain,
            verdict: externalVerdict.verdict,
            source: externalVerdict.source
        };
    }

    normalizeEmailDomain(email) {
        return email
            .substring(email.lastIndexOf('@') + 1)
            .trim()
            .toLowerCase();
    }

    getLocalDisposableEmailVerdict(domain) {
        if (disposableEmailDomains.has(domain)) {
            return {
                verdict: EmailRiskVerdict.Deny,
                source: 'local-list'
            };
        }

        return {
            verdict: EmailRiskVerdict.Allow,
            source: 'local-list'
        };
    }

    async getDisposableEmailServiceVerdict(domain) {
        let emailBlockKey = this.getOptionalConfigValue('emailBlockKey');

        if (!emailBlockKey) {
            return {
                verdict: EmailRiskVerdict.Unknown,
                source: 'block-disposable-email'
            };
        }

        let cachedVerdict = await this.getCachedDisposableEmailVerdict(domain);
        if (cachedVerdict) {
            return cachedVerdict;
        }

        try {
            let response = await fetch(
                `http://check.block-disposable-email.com/easyapi/json/${emailBlockKey}/${domain}`
            );

            if (!response.ok) {
                logger.warn(
                    'Failed to check email address %s: unexpected status %s',
                    domain,
                    response.status
                );

                return await this.cacheDisposableEmailVerdict(domain, {
                    verdict: EmailRiskVerdict.Unknown,
                    source: 'block-disposable-email'
                });
            }

            let answer = await response.json();

            if (answer.request_status !== 'success') {
                logger.warn('Failed to check email address %s', JSON.stringify(answer));

                return await this.cacheDisposableEmailVerdict(domain, {
                    verdict: EmailRiskVerdict.Unknown,
                    source: 'block-disposable-email'
                });
            }

            return await this.cacheDisposableEmailVerdict(domain, {
                verdict:
                    answer.domain_status === 'block'
                        ? EmailRiskVerdict.Deny
                        : EmailRiskVerdict.Allow,
                source: 'block-disposable-email'
            });
        } catch (err) {
            logger.warn('Could not validate email address %s %s', domain, err);

            return await this.cacheDisposableEmailVerdict(domain, {
                verdict: EmailRiskVerdict.Unknown,
                source: 'block-disposable-email'
            });
        }
    }

    getOptionalConfigValue(key) {
        return config.has(key) ? config.get(key) : undefined;
    }

    getCacheKey(domain) {
        return `${this.keyPrefix}:disposable-email:${domain}`;
    }

    async getCachedDisposableEmailVerdict(domain) {
        try {
            let cachedVerdict = await this.getAsync(this.getCacheKey(domain));
            if (!cachedVerdict) {
                return undefined;
            }

            return JSON.parse(cachedVerdict);
        } catch (err) {
            logger.warn('Failed to read disposable email cache for %s %s', domain, err);
            return undefined;
        }
    }

    async cacheDisposableEmailVerdict(domain, verdict) {
        let ttl =
            verdict.verdict === EmailRiskVerdict.Unknown
                ? this.unknownVerdictTtlSeconds
                : this.knownVerdictTtlSeconds;

        try {
            await this.setexAsync(this.getCacheKey(domain), ttl, JSON.stringify(verdict));
        } catch (err) {
            logger.warn('Failed to write disposable email cache for %s %s', domain, err);
        }

        return verdict;
    }

    onRedisError(err) {
        logger.error('Redis error: %s', err);
    }
}

export default DisposableEmailService;

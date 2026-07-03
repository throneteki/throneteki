import { promisify } from 'util';
import config from 'config';
import redis from 'redis';
import logger from '../log.js';

const KnownRiskCacheTtlSeconds = 60 * 60 * 24 * 30;
const UnknownRiskCacheTtlSeconds = 60 * 15;

class IPQualityScoreService {
    constructor(configService) {
        this.configService = configService;
        this.keyPrefix = configService.getValue('redisKeyPrefix');
        this.knownRiskCacheTtlSeconds =
            configService.getValue('ipQualityScoreCacheTtlSeconds') || KnownRiskCacheTtlSeconds;
        this.unknownRiskCacheTtlSeconds =
            configService.getValue('ipQualityScoreUnknownCacheTtlSeconds') ||
            UnknownRiskCacheTtlSeconds;

        this.redis = redis.createClient(configService.getValue('redisUrl'));
        this.redis.on('error', this.onRedisError);

        this.getAsync = promisify(this.redis.get).bind(this.redis);
        this.setexAsync = promisify(this.redis.setex).bind(this.redis);
    }

    async assessRegistration({ email }) {
        let key = this.getOptionalConfigValue('ipQualityScoreKey');
        if (!key) {
            return {
                denyRegistration: false,
                riskFlags: [],
                riskScoreDelta: 0,
                findings: {}
            };
        }

        let emailResult = await this.lookupEmail(email);

        let riskFlags = [];
        let riskScoreDelta = 0;
        let denyRegistration = false;

        if (emailResult?.success) {
            if (emailResult.disposable === true) {
                riskFlags.push('ipqs_disposable_email');
                riskScoreDelta += 50;
                denyRegistration = true;
            }

            if (emailResult.honeypot === true) {
                riskFlags.push('ipqs_honeypot_email');
                riskScoreDelta += 40;
            }

            if (emailResult.recent_abuse === true) {
                riskFlags.push('ipqs_email_recent_abuse');
                riskScoreDelta += 25;
            }

            if (emailResult.spam_trap_score === 'high') {
                riskFlags.push('ipqs_email_spam_trap');
                riskScoreDelta += 30;
            }

            if (typeof emailResult.fraud_score === 'number') {
                if (emailResult.fraud_score >= 90) {
                    riskFlags.push('ipqs_email_fraud_score_90');
                    riskScoreDelta += 35;
                } else if (emailResult.fraud_score >= 85) {
                    riskFlags.push('ipqs_email_fraud_score_85');
                    riskScoreDelta += 35;
                } else if (emailResult.fraud_score >= 75) {
                    riskFlags.push('ipqs_email_fraud_score_75');
                    riskScoreDelta += 20;
                } else if (emailResult.fraud_score >= 50) {
                    riskFlags.push('ipqs_email_fraud_score_50');
                    riskScoreDelta += 10;
                }
            }
        }

        return {
            denyRegistration,
            riskFlags: [...new Set(riskFlags)],
            riskScoreDelta,
            findings: {
                email: emailResult?.success ? emailResult : undefined
            }
        };
    }

    async lookupEmail(email) {
        if (!email) {
            return undefined;
        }

        return this.lookupAndCache({
            cacheKey: this.getCacheKey('email', this.normalizeCacheValue(email)),
            requestPath: `email/${this.getOptionalConfigValue('ipQualityScoreKey')}/${encodeURIComponent(email)}`
        });
    }

    async lookupAndCache({ cacheKey, requestPath }) {
        let cachedResponse = await this.getCachedResponse(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }

        try {
            let response = await fetch(`https://ipqualityscore.com/api/json/${requestPath}`);

            if (!response.ok) {
                logger.warn(
                    'IPQS lookup failed with status %s for %s',
                    response.status,
                    requestPath
                );
                return await this.cacheResponse(cacheKey, { success: false }, true);
            }

            let payload = await response.json();
            if (payload.success === false) {
                logger.warn(
                    'IPQS lookup returned unsuccessful response %s',
                    JSON.stringify(payload)
                );
            }

            return await this.cacheResponse(cacheKey, payload, payload.success === false);
        } catch (err) {
            logger.warn('IPQS lookup failed for %s %s', requestPath, err);
            return await this.cacheResponse(cacheKey, { success: false }, true);
        }
    }

    async getCachedResponse(cacheKey) {
        try {
            let value = await this.getAsync(cacheKey);
            return value ? JSON.parse(value) : undefined;
        } catch (err) {
            logger.warn('Failed to read IPQS cache for %s %s', cacheKey, err);
            return undefined;
        }
    }

    async cacheResponse(cacheKey, payload, isUnknown) {
        try {
            await this.setexAsync(
                cacheKey,
                isUnknown ? this.unknownRiskCacheTtlSeconds : this.knownRiskCacheTtlSeconds,
                JSON.stringify(payload)
            );
        } catch (err) {
            logger.warn('Failed to write IPQS cache for %s %s', cacheKey, err);
        }

        return payload;
    }

    getCacheKey(scope, value) {
        return `${this.keyPrefix}:ipqs:${scope}:${value}`;
    }

    normalizeCacheValue(value) {
        return String(value).trim().toLowerCase();
    }

    getOptionalConfigValue(key) {
        return config.has(key) ? config.get(key) : undefined;
    }

    onRedisError(err) {
        logger.error('Redis error: %s', err);
    }
}

export default IPQualityScoreService;

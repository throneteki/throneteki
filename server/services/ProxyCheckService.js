import { promisify } from 'util';
import config from 'config';
import redis from 'redis';
import logger from '../log.js';

const KnownRiskCacheTtlSeconds = 60 * 60 * 24 * 30;
const UnknownRiskCacheTtlSeconds = 60 * 15;

class ProxyCheckService {
    constructor(configService) {
        this.configService = configService;
        this.keyPrefix = configService.getValue('redisKeyPrefix');
        this.knownRiskCacheTtlSeconds =
            configService.getValue('proxyCheckCacheTtlSeconds') || KnownRiskCacheTtlSeconds;
        this.unknownRiskCacheTtlSeconds =
            configService.getValue('proxyCheckUnknownCacheTtlSeconds') ||
            UnknownRiskCacheTtlSeconds;

        this.redis = redis.createClient(configService.getValue('redisUrl'));
        this.redis.on('error', this.onRedisError);

        this.getAsync = promisify(this.redis.get).bind(this.redis);
        this.setexAsync = promisify(this.redis.setex).bind(this.redis);
    }

    async assessRegistration({ ip }) {
        let key = this.getOptionalConfigValue('proxyCheckKey');
        if (!key || !ip) {
            return {
                denyRegistration: false,
                riskFlags: [],
                riskScoreDelta: 0,
                findings: {}
            };
        }

        let result = await this.lookupIp(ip);
        if (!result?.success) {
            return {
                denyRegistration: false,
                riskFlags: [],
                riskScoreDelta: 0,
                findings: {}
            };
        }

        let riskFlags = [];
        let riskScoreDelta = 0;

        if (result.proxy === 'yes') {
            riskFlags.push('proxycheck_proxy');
            riskScoreDelta += 30;
        }

        if (result.type === 'VPN') {
            riskFlags.push('proxycheck_vpn');
            riskScoreDelta += 15;
        }

        if (result.type === 'TOR') {
            riskFlags.push('proxycheck_tor');
            riskScoreDelta += 35;
        }

        if (typeof result.risk === 'string') {
            let risk = parseInt(result.risk, 10);
            if (!Number.isNaN(risk)) {
                if (risk >= 100) {
                    riskFlags.push('proxycheck_risk_100');
                    riskScoreDelta += 40;
                } else if (risk >= 75) {
                    riskFlags.push('proxycheck_risk_75');
                    riskScoreDelta += 25;
                } else if (risk >= 50) {
                    riskFlags.push('proxycheck_risk_50');
                    riskScoreDelta += 10;
                }
            }
        }

        return {
            denyRegistration: false,
            riskFlags: [...new Set(riskFlags)],
            riskScoreDelta,
            findings: { ip: result }
        };
    }

    async lookupIp(ip) {
        let normalizedIp = this.normalizeCacheValue(ip);

        return this.lookupAndCache({
            cacheKey: this.getCacheKey(normalizedIp),
            requestUrl: `https://proxycheck.io/v2/${encodeURIComponent(
                ip
            )}?key=${this.getOptionalConfigValue('proxyCheckKey')}&vpn=1&risk=1`
        });
    }

    async lookupAndCache({ cacheKey, requestUrl }) {
        let cachedResponse = await this.getCachedResponse(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }

        try {
            let response = await fetch(requestUrl);
            if (!response.ok) {
                logger.warn(
                    'Proxycheck lookup failed with status %s for %s',
                    response.status,
                    requestUrl
                );
                return await this.cacheResponse(cacheKey, { success: false }, true);
            }

            let payload = await response.json();
            let result = this.extractLookupResult(payload);

            if (!result?.success) {
                logger.warn(
                    'Proxycheck lookup returned unsuccessful response %s',
                    JSON.stringify(payload)
                );
                return await this.cacheResponse(cacheKey, { success: false }, true);
            }

            return await this.cacheResponse(cacheKey, result, false);
        } catch (err) {
            logger.warn('Proxycheck lookup failed for %s %s', requestUrl, err);
            return await this.cacheResponse(cacheKey, { success: false }, true);
        }
    }

    extractLookupResult(payload) {
        if (!payload || (payload.status !== 'ok' && payload.status !== 'warning')) {
            return { success: false };
        }

        let ipEntry = Object.entries(payload).find(
            ([key]) => key !== 'status' && key !== 'node' && key !== 'query time'
        );

        if (!ipEntry || typeof ipEntry[1] !== 'object') {
            return { success: false };
        }

        return {
            success: true,
            ...ipEntry[1]
        };
    }

    async getCachedResponse(cacheKey) {
        try {
            let value = await this.getAsync(cacheKey);
            return value ? JSON.parse(value) : undefined;
        } catch (err) {
            logger.warn('Failed to read proxycheck cache for %s %s', cacheKey, err);
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
            logger.warn('Failed to write proxycheck cache for %s %s', cacheKey, err);
        }

        return payload;
    }

    getCacheKey(ip) {
        return `${this.keyPrefix}:proxycheck:ip:${ip}`;
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

export default ProxyCheckService;

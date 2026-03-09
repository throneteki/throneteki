import logger from '../log.js';

const DefaultCleanupIntervalMs = 6 * 60 * 60 * 1000;

class MaintenanceService {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
        this.cleanupIntervalMs =
            configService.getValue('maintenanceCleanupIntervalMs') || DefaultCleanupIntervalMs;
        this.interval = undefined;
    }

    start() {
        if (this.interval) {
            return;
        }

        this.runCleanup().catch((err) => {
            logger.error('Initial maintenance cleanup failed %s', err);
        });

        this.interval = setInterval(() => {
            this.runCleanup().catch((err) => {
                logger.error('Scheduled maintenance cleanup failed %s', err);
            });
        }, this.cleanupIntervalMs);
    }

    stop() {
        if (!this.interval) {
            return;
        }

        clearInterval(this.interval);
        this.interval = undefined;
    }

    async runCleanup() {
        let expiredUnverifiedAccounts = await this.userService.deleteExpiredUnverifiedAccounts();
        let removedRefreshTokens = await this.userService.cleanupRefreshTokens();
        let removedLegacySessions = await this.userService.cleanupLegacySessions();

        logger.info(
            'Maintenance cleanup complete: expired_unverified=%s refresh_tokens=%s legacy_sessions=%s',
            expiredUnverifiedAccounts,
            removedRefreshTokens,
            removedLegacySessions
        );
    }
}

export default MaintenanceService;

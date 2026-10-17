import { getConnectionConfig } from '../../../server/db/connectionConfig.js';

describe('getConnectionConfig', function () {
    beforeEach(function () {
        this.dbConfig = {
            host: 'postgres',
            database: 'throneteki',
            user: 'throneteki_app',
            password: 'app-password',
            migrator: { user: 'throneteki_migrator', password: 'migrator-password' }
        };
    });

    it('should connect as the application role by default', function () {
        const config = getConnectionConfig(this.dbConfig);

        expect(config.user).toBe('throneteki_app');
        expect(config.password).toBe('app-password');
    });

    it('should connect as the migrator role when asked', function () {
        const config = getConnectionConfig(this.dbConfig, { migrator: true });

        expect(config.user).toBe('throneteki_migrator');
        expect(config.password).toBe('migrator-password');
    });

    it('should fall back to the application role when no migrator is configured', function () {
        delete this.dbConfig.migrator;

        const config = getConnectionConfig(this.dbConfig, { migrator: true });

        expect(config.user).toBe('throneteki_app');
    });

    it('should default the port and pool size', function () {
        const config = getConnectionConfig(this.dbConfig);

        expect(config.port).toBe(5432);
        expect(config.max).toBe(10);
    });

    it('should throw when postgres is not configured', function () {
        expect(() => getConnectionConfig(undefined)).toThrowError(/not configured/);
        expect(() => getConnectionConfig({ host: 'postgres' })).toThrowError(/not configured/);
    });
});

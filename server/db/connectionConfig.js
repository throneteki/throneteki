export function getConnectionConfig(dbConfig, { migrator = false } = {}) {
    if (!dbConfig || !dbConfig.host || !dbConfig.database) {
        throw new Error("Postgres is not configured, set 'db.host' and 'db.database'");
    }

    const credentials = migrator && dbConfig.migrator?.user ? dbConfig.migrator : dbConfig;

    return {
        host: dbConfig.host,
        port: dbConfig.port || 5432,
        database: dbConfig.database,
        user: credentials.user,
        password: credentials.password,
        ssl: dbConfig.ssl || undefined,
        max: dbConfig.poolSize || 10
    };
}

import db from '../../../../server/db/index.js';
import ConfigService from '../../../../server/services/ConfigService.js';

const database = new ConfigService().getValue('db')?.database;

if (!database || !database.endsWith('_test')) {
    throw new Error(
        `Refusing to run database integration tests against '${database}', the database name must end in _test`
    );
}

export async function resetDatabase() {
    const tables = await db.query(
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> 'pgmigrations'"
    );

    if (tables.length > 0) {
        await db.query(
            `TRUNCATE ${tables.map((table) => `"${table.tablename}"`).join(', ')} RESTART IDENTITY CASCADE`
        );
    }
}

afterAll(async function () {
    await db.shutdown();
});

export default db;

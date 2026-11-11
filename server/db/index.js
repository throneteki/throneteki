import pg from 'pg';
import ConfigService from '../services/ConfigService.js';
import logger from '../log.js';
import { getConnectionConfig } from './connectionConfig.js';

pg.types.setTypeParser(pg.types.builtins.INT8, (value) => parseInt(value, 10));

let pool;

function getPool() {
    if (!pool) {
        pool = new pg.Pool(getConnectionConfig(new ConfigService().getValue('db')));

        // Without a listener, an error on an idle client crashes the process
        pool.on('error', (err) => {
            logger.error('Postgres pool error %s', err);
        });
    }

    return pool;
}

export async function query(text, params = []) {
    const result = await getPool().query(text, params);

    return result.rows;
}

export async function transaction(callback) {
    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        const result = await callback({
            query: async (text, params = []) => (await client.query(text, params)).rows
        });

        await client.query('COMMIT');

        return result;
    } catch (err) {
        await client.query('ROLLBACK');

        throw err;
    } finally {
        client.release();
    }
}

export async function shutdown() {
    if (pool) {
        await pool.end();
        pool = undefined;
    }
}

export default { query, transaction, shutdown };

import pg from 'pg';
import ConfigService from '../services/ConfigService.js';
import logger from '../log.js';
import { getConnectionConfig } from './connectionConfig.js';

// bigint columns (identity keys, count(*)) come back as strings by default. Our values stay far
// below Number.MAX_SAFE_INTEGER, so return them as numbers.
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => parseInt(value, 10));

let pool;

// The pool is created on first use so importing this module never opens a connection
function getPool() {
    if (!pool) {
        pool = new pg.Pool(getConnectionConfig(new ConfigService().getValue('db')));

        // An idle client losing its connection emits here; without a listener it crashes the process
        pool.on('error', (err) => {
            logger.error('Postgres pool error %s', err);
        });
    }

    return pool;
}

/**
 * Runs a single query and returns its rows.
 * @param {string} text
 * @param {any[]} [params]
 */
export async function query(text, params = []) {
    const result = await getPool().query(text, params);

    return result.rows;
}

/**
 * Runs the callback inside a transaction on one pooled connection, committing if it succeeds and
 * rolling back if it throws. Queries must go through the `query` function the callback is given.
 * @template T
 * @param {(tx: { query: typeof query }) => Promise<T>} callback
 * @returns {Promise<T>}
 */
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

/*eslint no-console: 0*/
import fs from 'fs';
import commandLineArgs from 'command-line-args';
import monk from 'monk';
import db from '../db/index.js';
import ServiceFactory from '../services/ServiceFactory.js';
import { CollectionNames, copyFromMongo } from './mongo-to-postgres/copy.js';

const options = commandLineArgs([
    { name: 'collections', type: String, multiple: true, defaultValue: CollectionNames },
    { name: 'since', type: String },
    { name: 'batch-size', type: Number, defaultValue: 1000 },
    { name: 'report', type: String, defaultValue: 'migrate-from-mongo-report.json' }
]);

function monkSource(mongo) {
    return {
        count: (collection, query) => mongo.get(collection).count(query),
        async *batches(collection, query, size) {
            let lastId;

            for (;;) {
                const filter = lastId ? { $and: [query, { _id: { $gt: lastId } }] } : query;
                const docs = await mongo
                    .get(collection)
                    .find(filter, { sort: { _id: 1 }, limit: size });

                if (docs.length === 0) {
                    return;
                }

                yield docs;

                if (docs.length < size) {
                    return;
                }

                lastId = docs[docs.length - 1]._id;
            }
        }
    };
}

async function run() {
    const unknown = options.collections.filter(
        (collection) => !CollectionNames.includes(collection)
    );
    if (unknown.length > 0) {
        throw new Error(
            `Unknown collections ${unknown.join(', ')}, expected some of ${CollectionNames.join(', ')}`
        );
    }

    const since = options.since ? new Date(options.since) : undefined;
    if (since && Number.isNaN(since.getTime())) {
        throw new Error(`Invalid --since ${options.since}`);
    }

    const mongo = monk(ServiceFactory.configService().getValue('dbPath'));

    try {
        const report = await copyFromMongo({
            source: monkSource(mongo),
            db,
            collections: options.collections,
            since,
            batchSize: options['batch-size'],
            log: (message) => console.info(message)
        });

        fs.writeFileSync(options.report, JSON.stringify(report, null, 4));

        console.info('');
        for (const [collection, stats] of Object.entries(report)) {
            const skipped = Object.values(stats.skipped || {}).reduce(
                (total, entry) => total + entry.count,
                0
            );
            console.info(
                `${collection.padEnd(14)} read ${String(stats.read ?? '-').padStart(8)}  copied ${String(stats.copied).padStart(8)}  skipped ${String(skipped).padStart(6)}  in postgres ${String(stats.postgresCount ?? '-').padStart(8)}`
            );
        }

        for (const [collection, stats] of Object.entries(report)) {
            for (const kind of ['skipped', 'issues']) {
                for (const [reason, entry] of Object.entries(stats[kind] || {})) {
                    console.info(
                        `${collection} ${kind}: ${reason} (${entry.count}, e.g. ${entry.examples.join(', ')})`
                    );
                }
            }
        }

        console.info(
            `\nFull report, with the reasons for skipped rows and changes, in ${options.report}`
        );
    } finally {
        await mongo.close();
        await db.shutdown();
    }
}

run().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});

/*eslint no-console:0 */
import fs from 'fs';
import { parseArgs } from 'util';

import db from '../db/index.js';
import ConfigService from '../services/ConfigService.js';
import WrappedService from '../services/WrappedService.js';
import WrappedEmailService from '../services/WrappedEmailService.js';

// Works out each player's yearly Wrapped snapshot, and emails players to tell them it's ready. See
// docs/player-stats.md for the options and the order to run them in.

const { values: options } = parseArgs({
    options: {
        year: { type: 'string' },
        to: { type: 'string' },
        user: { type: 'string' },
        email: { type: 'boolean', default: false },
        preview: { type: 'string' },
        'per-second': { type: 'string', default: '10' },
        apply: { type: 'boolean', default: false }
    }
});

const DatePattern = /^\d{4}-\d{2}-\d{2}$/;

async function generate(year) {
    const today = new Date().toISOString().slice(0, 10);
    const endOfYear = `${year + 1}-01-01`;
    const to = options.to || (today < endOfYear ? today : endOfYear);

    if (!DatePattern.test(to) || to <= `${year}-01-01` || to > endOfYear) {
        throw new Error(`--to must be a date in ${year} or ${endOfYear}`);
    }

    const result = await new WrappedService().generate({
        year,
        to,
        username: options.user,
        dryRun: !options.apply,
        progress: (message) => console.info(message)
    });

    if (result.sample && !options.apply) {
        console.info(JSON.stringify(result.sample, null, 2));
    }

    console.info(
        `${options.apply ? 'Saved' : 'Would save'} ${result.saved} snapshots, ${result.failed} failed`
    );
}

async function email(year) {
    const result = await new WrappedEmailService(new ConfigService()).send({
        year,
        username: options.user,
        dryRun: !options.apply,
        perSecond: Number(options['per-second']) || 10,
        progress: (message) => console.info(message)
    });

    if (options.preview && result.sample) {
        fs.writeFileSync(options.preview, result.sample.html);
        console.info(`Saved "${result.sample.subject}" to ${options.preview}`);
    }

    if (!options.apply) {
        console.info(`Would email ${result.recipients} players`);

        return;
    }

    console.info(`Sent ${result.sent} emails, ${result.failed} failed`);

    if (result.unrecorded.length > 0) {
        console.error(
            'These players were emailed but could not be marked as emailed. Set emailed_at for them before ' +
                `running this again, or they will be emailed twice: ${result.unrecorded.join(', ')}`
        );
        process.exitCode = 1;
    }
}

async function main() {
    const year = options.year ? Number(options.year) : new Date().getUTCFullYear();
    if (!Number.isInteger(year)) {
        throw new Error('--year must be a year');
    }

    await (options.email ? email(year) : generate(year));

    if (!options.apply) {
        console.info('Nothing was changed. Run again with --apply to do it.');
    }
}

main()
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => db.shutdown());

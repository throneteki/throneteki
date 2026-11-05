/* eslint no-console: 0 */

// Reports how many implemented cards have a spec, per pack.
//
//   node test/tools/spec-coverage.js            table per pack plus the total
//   node test/tools/spec-coverage.js --json     the same data as JSON
//   node test/tools/spec-coverage.js --missing  card files without a spec
//   node test/tools/spec-coverage.js --changed <base>
//       card files added or changed since <base> (e.g. origin/master) that have no spec;
//       exits with 1 if there are any, for CI
//   node test/tools/spec-coverage.js --check-verified
//       exits with 1 if any implemented card is not verified, for CI. A card is verified when its
//       spec follows the conventions and its implementation has no handler; card-rules and the
//       ability coverage check in the test run cover the rest (docs/engine.md)

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { loadCardData, loadImplementations, repoRoot, specStyleProblems } from './cardIndex.js';
import { formatCoverage } from './formatCoverage.js';

const args = process.argv.slice(2);
const implementations = loadImplementations();

// card-rules (run in CI) refuses any phased-out pattern in a card file, so only handlers are left
// to check here.
function isDeclarative(implementation) {
    return !implementation.hasHandler;
}

function specFollowsConventions(implementation) {
    const source = fs.readFileSync(path.join(repoRoot, implementation.specPath), 'utf8');
    return specStyleProblems(source).length === 0;
}

function isVerified(implementation) {
    return (
        implementation.hasSpec &&
        isDeclarative(implementation) &&
        specFollowsConventions(implementation)
    );
}

function percentage(covered, total) {
    return total === 0 ? '-' : `${((covered / total) * 100).toFixed(1)}%`;
}

// A change to comments alone, such as regenerating a card's text comment, does not need a spec.
const ignoreComments = '--ignore-matching-lines=^\\s*//';

function changedCardFiles(base) {
    const committed = execFileSync(
        'git',
        ['diff', '--name-only', '--diff-filter=AMR', ignoreComments, `${base}...HEAD`],
        {
            cwd: repoRoot,
            encoding: 'utf8'
        }
    );
    const working = execFileSync(
        'git',
        ['diff', '--name-only', '--diff-filter=AMR', ignoreComments, 'HEAD'],
        {
            cwd: repoRoot,
            encoding: 'utf8'
        }
    );
    const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {
        cwd: repoRoot,
        encoding: 'utf8'
    });
    return new Set(
        [committed, working, untracked]
            .flatMap((output) => output.split('\n'))
            .filter((file) => file.startsWith('server/game/cards/') && file.endsWith('.js'))
    );
}

if (args[0] === '--changed') {
    const base = args[1];
    if (!base) {
        console.error('Usage: spec-coverage.js --changed <base>');
        process.exit(2);
    }

    const changed = changedCardFiles(base);
    const missing = implementations.filter(
        (implementation) =>
            changed.has(implementation.implementationPath) && !implementation.hasSpec
    );

    if (missing.length > 0) {
        console.error('These card files were added or changed without a spec:');
        for (const implementation of missing) {
            console.error(`  ${implementation.implementationPath} -> ${implementation.specPath}`);
        }
        process.exit(1);
    }

    console.log(`All ${changed.size} changed card files have specs.`);
    process.exit(0);
}

if (args[0] === '--check-verified') {
    const unverified = implementations.filter((implementation) => !isVerified(implementation));

    if (unverified.length > 0) {
        console.error(
            'Every implemented card must be verified. These are not (see docs/engine.md):'
        );
        for (const implementation of unverified) {
            const reason = !implementation.hasSpec
                ? 'no spec'
                : !isDeclarative(implementation)
                  ? 'the implementation has a handler'
                  : 'the spec uses a manual action, a harness shortcut or the old test style';
            console.error(`  ${implementation.implementationPath}: ${reason}`);
        }
        process.exit(1);
    }

    console.log(`All ${implementations.length} implemented card files are verified.`);
    process.exit(0);
}

if (args.includes('--formats')) {
    const packsRoot = path.join(repoRoot, 'throneteki-json-data/packs');
    const packs = fs
        .readdirSync(packsRoot)
        .filter((file) => file.endsWith('.json'))
        .map((file) => JSON.parse(fs.readFileSync(path.join(packsRoot, file), 'utf8')));
    const formats = formatCoverage({
        cards: loadCardData(),
        packs,
        lists: JSON.parse(
            fs.readFileSync(
                path.join(repoRoot, 'throneteki-json-data/restricted-list.json'),
                'utf8'
            )
        ),
        implementations,
        verifiedCodes: new Set(implementations.filter(isVerified).flatMap((item) => item.codes))
    });
    if (args.includes('--json')) {
        console.log(JSON.stringify({ formats }, null, 2));
    } else {
        const width = Math.max('Format'.length, ...formats.map((format) => format.name.length));
        console.log(`${'Format'.padEnd(width)}  Specs  Verified  No code  Cards  Playable`);
        for (const format of formats) {
            console.log(
                `${format.name.padEnd(width)}  ${String(format.specs).padStart(5)}  ${String(format.verified).padStart(8)}  ${String(format.noCode).padStart(7)}  ${String(format.total).padStart(5)}  ${percentage(format.playable, format.total).padStart(8)}`
            );
        }
    }
    process.exit(0);
}

if (args[0] === '--missing') {
    for (const implementation of implementations.filter(
        (implementation) => !implementation.hasSpec
    )) {
        console.log(implementation.implementationPath);
    }
    process.exit(0);
}

const groups = new Map();
for (const implementation of implementations) {
    const group = groups.get(implementation.group) || { total: 0, covered: 0 };
    group.total += 1;
    group.covered += implementation.hasSpec ? 1 : 0;
    groups.set(implementation.group, group);
}

const total = implementations.length;
const covered = implementations.filter((implementation) => implementation.hasSpec).length;

if (args[0] === '--json') {
    console.log(
        JSON.stringify(
            {
                total,
                covered,
                packs: Object.fromEntries(groups)
            },
            null,
            2
        )
    );
    process.exit(0);
}

const width = Math.max(...[...groups.keys()].map((name) => name.length), 'Pack'.length);
console.log(`${'Pack'.padEnd(width)}  Specs  Cards  Coverage`);
for (const [name, group] of groups) {
    console.log(
        `${name.padEnd(width)}  ${String(group.covered).padStart(5)}  ${String(group.total).padStart(5)}  ${percentage(group.covered, group.total).padStart(8)}`
    );
}
console.log(
    `${'Total'.padEnd(width)}  ${String(covered).padStart(5)}  ${String(total).padStart(5)}  ${percentage(covered, total).padStart(8)}`
);

/* eslint no-console: 0 */

// Reports how many implemented cards have a spec, per pack.
//
//   node test/tools/spec-coverage.js            table per pack plus the total
//   node test/tools/spec-coverage.js --json     the same data as JSON
//   node test/tools/spec-coverage.js --missing  card files without a spec
//   node test/tools/spec-coverage.js --changed <base>
//       card files added or changed since <base> (e.g. origin/master) that have no spec;
//       exits with 1 if there are any, for CI
//   node test/tools/spec-coverage.js --write-verified
//       writes verified card codes to server/game/verifiedCards.json, which decides whether a
//       game starts with manual mode off. A card is verified when it has a spec and its
//       implementation has no handler and no card-rules violations (docs/engine-roadmap.md)
//   node test/tools/spec-coverage.js --check-verified
//       exits with 1 if server/game/verifiedCards.json is out of date, for CI

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { loadImplementations, repoRoot } from './cardIndex.js';

const args = process.argv.slice(2);
const implementations = loadImplementations();
const rulesBaseline = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'test/tools/card-rules-baseline.json'), 'utf8')
);

function isDeclarative(implementation) {
    if (implementation.hasHandler) {
        return false;
    }

    const counts = rulesBaseline[implementation.implementationPath];
    return !counts || Object.values(counts).every((count) => count === 0);
}

function isVerified(implementation) {
    return implementation.hasSpec && isDeclarative(implementation);
}

function percentage(covered, total) {
    return total === 0 ? '-' : `${((covered / total) * 100).toFixed(1)}%`;
}

function changedCardFiles(base) {
    const committed = execFileSync(
        'git',
        ['diff', '--name-only', '--diff-filter=AMR', `${base}...HEAD`],
        {
            cwd: repoRoot,
            encoding: 'utf8'
        }
    );
    const working = execFileSync('git', ['diff', '--name-only', '--diff-filter=AMR', 'HEAD'], {
        cwd: repoRoot,
        encoding: 'utf8'
    });
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

if (args[0] === '--write-verified' || args[0] === '--check-verified') {
    const verifiedPath = path.join(repoRoot, 'server/game/verifiedCards.json');
    const codes = implementations
        .filter((implementation) => isVerified(implementation))
        .flatMap((implementation) => implementation.codes)
        .sort();
    const contents = JSON.stringify(codes, null, 4) + '\n';

    if (args[0] === '--write-verified') {
        fs.writeFileSync(verifiedPath, contents);
        console.log(`Wrote ${codes.length} verified card codes to server/game/verifiedCards.json.`);
        process.exit(0);
    }

    const current = fs.existsSync(verifiedPath) ? fs.readFileSync(verifiedPath, 'utf8') : '';
    if (current !== contents) {
        console.error(
            'server/game/verifiedCards.json is out of date. Run "npm run spec:coverage -- --write-verified".'
        );
        process.exit(1);
    }

    console.log(`server/game/verifiedCards.json lists all ${codes.length} verified cards.`);
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

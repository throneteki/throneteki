/* eslint no-console: 0 */

// Fails if a card file uses a pattern that card code must not use (see server/game/cards/CLAUDE.md).
//
//   node test/tools/card-rules.js            fails if any card file uses one
//   node test/tools/card-rules.js --report   totals per rule

import path from 'path';
import { loadESLint } from 'eslint';
import { repoRoot } from './cardIndex.js';

import { Rules } from './cardRuleDefinitions.js';

function ruleFor(message) {
    return Object.entries(Rules).find(([, rule]) => rule.message === message)?.[0];
}

async function countUses() {
    const FlatESLint = await loadESLint({ useFlatConfig: true });
    const eslint = new FlatESLint({
        cwd: repoRoot,
        overrideConfigFile: true,
        overrideConfig: {
            languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
            rules: {
                'no-restricted-syntax': [
                    'error',
                    ...Object.values(Rules).map(({ selector, message }) => ({ selector, message }))
                ]
            }
        }
    });
    const results = await eslint.lintFiles(['server/game/cards/**/*.js']);
    const counts = {};

    for (const result of results) {
        const file = path.relative(repoRoot, result.filePath).split(path.sep).join('/');
        for (const message of result.messages) {
            const rule = ruleFor(message.message);
            if (!rule) {
                throw new Error(`${file}:${message.line}: ${message.message}`);
            }
            counts[file] = counts[file] || {};
            counts[file][rule] = (counts[file][rule] || 0) + 1;
        }
    }

    return counts;
}

const counts = await countUses();

if (process.argv[2] === '--report') {
    const totals = {};
    for (const fileCounts of Object.values(counts)) {
        for (const [rule, count] of Object.entries(fileCounts)) {
            totals[rule] = (totals[rule] || 0) + count;
        }
    }
    for (const rule of Object.keys(Rules)) {
        console.log(`${rule.padEnd(20)} ${String(totals[rule] || 0).padStart(6)}`);
    }
    console.log(`files with any use: ${Object.keys(counts).length}`);
    process.exit(0);
}

const problems = Object.entries(counts).flatMap(([file, fileCounts]) =>
    Object.entries(fileCounts).map(
        ([rule, count]) => `  ${file}: ${rule} x${count} (${Rules[rule].message})`
    )
);

if (problems.length > 0) {
    console.error('Card code uses patterns that cards must not use (server/game/cards/CLAUDE.md):');
    console.error(problems.join('\n'));
    process.exit(1);
}

console.log('No card file uses a pattern that cards must not use.');

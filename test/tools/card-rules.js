/* eslint no-console: 0 */

// Counts uses of patterns that card code should no longer use (see server/game/cards/CLAUDE.md)
// and compares them with a checked-in baseline, so the counts can only go down.
//
//   node test/tools/card-rules.js            fails if any file has more uses than its baseline
//   node test/tools/card-rules.js --update   rewrites the baseline after counts have gone down
//   node test/tools/card-rules.js --report   totals per rule

import fs from 'fs';
import path from 'path';
import { loadESLint } from 'eslint';
import { repoRoot } from './cardIndex.js';

const baselineFile = path.join(repoRoot, 'test/tools/card-rules-baseline.json');

const LegacyHelpers = [
    'addGold',
    'addPower',
    'discardCard',
    'discardCards',
    'discardFromPlay',
    'drawCardsToHand',
    'killCharacter',
    'killCharacters',
    'kneelCard',
    'moveCard',
    'movePower',
    'standCard',
    'takeControl',
    'transferGold'
];
const CardState = ['controller', 'facedown', 'gold', 'kneeled', 'location', 'power'];

export const Rules = {
    'legacy-helper': {
        selector: `CallExpression[callee.type='MemberExpression'][callee.object.name!='GameActions'][callee.property.name=/^(${LegacyHelpers.join('|')})$/]`,
        message: 'Use a GameAction instead of the legacy helper'
    },
    'direct-state-write': {
        selector: `AssignmentExpression[left.type='MemberExpression'][left.property.name=/^(${CardState.join('|')})$/], UpdateExpression[argument.type='MemberExpression'][argument.property.name=/^(${CardState.join('|')})$/]`,
        message: 'Change game state through a GameAction'
    },
    'add-message': {
        selector: "CallExpression[callee.property.name='addMessage']",
        message: "Use the ability's message property"
    },
    'game-listener': {
        selector:
            "CallExpression[callee.property.name=/^(on|once)$/][callee.object.property.name='game']",
        message: 'Use GameActions.delayedEffect instead of listening for game events'
    },
    'prompt-for-select': {
        selector: "CallExpression[callee.property.name='promptForSelect']",
        message: 'Use a target instead of prompting inside a handler'
    }
};

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

function sorted(counts) {
    return Object.fromEntries(
        Object.keys(counts)
            .sort()
            .map((file) => [file, counts[file]])
    );
}

const counts = await countUses();
const mode = process.argv[2];

if (mode === '--report') {
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

const baseline = fs.existsSync(baselineFile)
    ? JSON.parse(fs.readFileSync(baselineFile, 'utf8'))
    : {};

if (mode === '--update') {
    const increased = Object.entries(counts).filter(([file, fileCounts]) =>
        Object.entries(fileCounts).some(([rule, count]) => count > (baseline[file]?.[rule] || 0))
    );
    if (increased.length > 0 && !process.argv.includes('--allow-increase')) {
        console.error('Not updating: these files have more uses than their baseline:');
        for (const [file] of increased) {
            console.error(`  ${file}`);
        }
        process.exit(1);
    }
    fs.writeFileSync(baselineFile, JSON.stringify(sorted(counts), null, 4) + '\n');
    console.log(`Baseline updated: ${Object.keys(counts).length} files`);
    process.exit(0);
}

const problems = [];
let improved = 0;
for (const [file, fileCounts] of Object.entries(counts)) {
    for (const [rule, count] of Object.entries(fileCounts)) {
        const allowed = baseline[file]?.[rule] || 0;
        if (count > allowed) {
            problems.push(`  ${file}: ${rule} ${allowed} -> ${count} (${Rules[rule].message})`);
        }
    }
}
for (const [file, fileCounts] of Object.entries(baseline)) {
    for (const [rule, allowed] of Object.entries(fileCounts)) {
        if ((counts[file]?.[rule] || 0) < allowed) {
            improved++;
        }
    }
}

if (problems.length > 0) {
    console.error(
        'Card code uses patterns that are being phased out (server/game/cards/CLAUDE.md):'
    );
    console.error(problems.join('\n'));
    process.exit(1);
}

if (improved > 0) {
    console.log(
        `${improved} counts are below the baseline; run "node test/tools/card-rules.js --update" to lock them in.`
    );
}
console.log('No card file uses more phased-out patterns than its baseline.');

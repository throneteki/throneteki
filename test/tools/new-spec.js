/* eslint no-console: 0 */

// Creates a spec skeleton for an implemented card at the path matching its implementation.
//
//   node test/tools/new-spec.js 01009

import fs from 'fs';
import path from 'path';
import { loadCardData, loadImplementations, repoRoot } from './cardIndex.js';

const code = process.argv[2];

if (!code) {
    console.error('Usage: new-spec.js <card code>');
    process.exit(2);
}

const card = loadCardData().get(code);
if (!card) {
    console.error(`No card with code ${code}.`);
    process.exit(1);
}

const implementation = loadImplementations().find((implementation) =>
    implementation.codes.includes(code)
);
if (!implementation) {
    console.error(`${card.name} (${code}) is not implemented.`);
    process.exit(1);
}

const specFile = path.join(repoRoot, implementation.specPath);
if (fs.existsSync(specFile)) {
    console.error(`${implementation.specPath} already exists.`);
    process.exit(1);
}

const quote = (value) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const text = (card.text || '').replace(/<\/?(b|i|em|strong)>/g, '').split('\n');
const phase = card.type === 'plot' ? 'plot' : 'marshal';
const zone = ['character', 'location', 'attachment'].includes(card.type) ? 'inPlay' : 'hand';
const playerSetup =
    card.type === 'plot'
        ? `plot: ${quote(card.name)}`
        : card.type === 'agenda'
          ? `agenda: ${quote(card.name)}`
          : `${zone}: [${quote(card.name)}]`;

const spec = `// ${card.name} (${card.packCode} ${card.code})
${text.map((line) => `// ${line}`).join('\n')}
describe(${quote(card.name)}, function () {
    describe('TODO: describe the board state', function () {
        beforeEach(function () {
            this.setupTest({
                phase: ${quote(phase)},
                player1: {
                    faction: ${quote(card.faction)},
                    ${playerSetup}
                },
                player2: {}
            });
        });

        it.todo('TODO: describe what happens');
    });
});
`;

fs.mkdirSync(path.dirname(specFile), { recursive: true });
fs.writeFileSync(specFile, spec);
console.log(`Created ${implementation.specPath}`);

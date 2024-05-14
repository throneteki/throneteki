/*eslint no-console:0 */

/**
 * Script to generate a markdown based todo list, so that we can track card
 * implementation status in Github issues.
 */

const fs = require('fs');
const path = require('path');

const packCode = process.argv[2];

if (!packCode) {
    console.log('Usage: implementation-status.js PACK_CODE [PATH_TO_JSON_DATA]');
    process.exit(1);
}

const pathToData = process.argv[3] || path.join(__dirname, '../../throneteki-json-data');
const packData = JSON.parse(fs.readFileSync(path.join(pathToData, 'packs', packCode + '.json')));
const implementedCards = require('../game/cards');

for (let card of packData.cards) {
    let checkedState = implementedCards[card.code] ? 'x' : ' ';
    console.log(
        `* [${checkedState}] ${card.code} - [${card.name}](https://thronesdb.com/card/${card.code})`
    );
}

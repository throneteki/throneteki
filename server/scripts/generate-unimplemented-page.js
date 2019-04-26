/*eslint no-console:0 */

/**
 * Script to generate a markdown based todo list, so that we can track card
 * implementation status in Github issues.
 */

const fs = require('fs');
const path = require('path');
const ExcludedCards = require('./generate-unimplemented-page/excluded-cards.json');

const pathToData = process.argv[2] || path.join(__dirname, '../../throneteki-json-data');
const packFiles = fs.readdirSync(path.join(pathToData, 'packs'));
const packs = packFiles.map(packFile => JSON.parse(fs.readFileSync(path.join(pathToData, 'packs', packFile))));
const implementedCards = require('../game/cards');

packs.sort((a, b) => a.cgdbId < b.cgdbId ? -1 : 1);

let output = '';

for(let pack of packs) {
    let missingCards = [];

    for(let card of pack.cards) {
        let cardClass = implementedCards[card.code];

        if(!cardClass && !ExcludedCards.includes(card.code)) {
            missingCards.push({ card, reason: 'Not implemented' });
        } else if(cardClass && cardClass.TODO) {
            missingCards.push({ card, reason: cardClass.TODO });
        }
    }

    if(missingCards.length !== 0) {
        output += `### ${pack.name}\n`;
        for(let card of missingCards) {
            output += `* **${card.card['name']}:** ${card.reason}\n`;
        }
        output += '\n';
    }
}

console.log(output);

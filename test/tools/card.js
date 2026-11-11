/* eslint no-console: 0 */

// Prints a card's data, its implementation file and its spec.
//
//   node test/tools/card.js 01009
//   node test/tools/card.js "The Hand's Judgment"

import { loadCardData, loadImplementations } from './cardIndex.js';

const query = process.argv.slice(2).join(' ').trim();

if (!query) {
    console.error('Usage: card.js <code or name>');
    process.exit(2);
}

const cardData = loadCardData();
const implementations = loadImplementations();
const lowerQuery = query.toLowerCase();
const matches = [...cardData.values()].filter(
    (card) => card.code === query || card.name.toLowerCase() === lowerQuery
);

if (matches.length === 0) {
    const partial = [...cardData.values()].filter((card) =>
        card.name.toLowerCase().includes(lowerQuery)
    );
    console.error(`No card named "${query}".`);
    if (partial.length > 0) {
        console.error('Did you mean:');
        for (const card of partial.slice(0, 15)) {
            console.error(`  ${card.code}  ${card.name} (${card.packCode})`);
        }
    }
    process.exit(1);
}

function stripTags(text) {
    return (text || '').replace(/<\/?(b|i|em|strong)>/g, '');
}

for (const card of matches) {
    const implementation = implementations.find((implementation) =>
        implementation.codes.includes(card.code)
    );
    const stats =
        card.type === 'plot'
            ? `income ${card.plotStats?.income}, initiative ${card.plotStats?.initiative}, claim ${card.plotStats?.claim}, reserve ${card.plotStats?.reserve}`
            : [
                  card.cost !== undefined && `cost ${card.cost}`,
                  card.strength !== undefined && `STR ${card.strength}`,
                  card.icons &&
                      `icons ${
                          Object.entries(card.icons)
                              .filter(([, value]) => value)
                              .map(([icon]) => icon)
                              .join(', ') || 'none'
                      }`
              ]
                  .filter(Boolean)
                  .join(', ');

    console.log(`${card.code}  ${card.name}${card.unique ? ' (unique)' : ''}`);
    console.log(`  Pack: ${card.packName} (${card.packCode})`);
    console.log(
        `  ${card.faction} ${card.type}${card.loyal ? ', loyal' : ''}${stats ? ` - ${stats}` : ''}`
    );
    if (card.traits?.length) {
        console.log(`  Traits: ${card.traits.join(', ')}`);
    }
    console.log(`  Text: ${stripTags(card.text).replace(/\n/g, '\n        ') || '(none)'}`);
    console.log(
        `  Implementation: ${implementation ? implementation.implementationPath : 'not implemented'}`
    );
    if (implementation) {
        console.log(
            `  Spec: ${implementation.specPath}${implementation.hasSpec ? '' : ' (missing)'}`
        );
    }
    console.log(`  https://thronesdb.com/card/${card.code}`);
}

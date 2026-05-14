import { isDraftCard } from '../index.js';

const DraftFormat = {
    name: 'draft',
    requiredDraw: 40,
    requiredPlots: 7, // other draft variants like VDS/cube may have different rules
    maxDoubledPlots: 1,
    cannotInclude: (card) => card.packCode !== 'ToJ',
    rules: [
        {
            message: 'Includes cards that were not drafted',
            condition: (deck) => {
                return deck.getUniqueCards().every((card) => isDraftCard(card));
            }
        }
    ]
};

export default DraftFormat;

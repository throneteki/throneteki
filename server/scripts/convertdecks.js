/*eslint no-console:0 */
const monk = require('monk');
const _ = require('underscore');
const ServiceFactory = require('../services/ServiceFactory.js');

let configService = ServiceFactory.configService();
let db = monk(configService.getValue('dbPath'));

let dbDecks = db.get('decks');

const convertDecks = async () => {
    let count = await dbDecks.count({});
    console.info(count, 'decks to process');
    let numberProcessed = 0;
    let chunkSize = 5000;

    while (numberProcessed < count) {
        let decks = await dbDecks.find({}, { limit: chunkSize, skip: numberProcessed });
        console.info('loaded', _.size(decks), 'decks');
        for (let deck of decks) {
            if (deck.agenda && typeof deck.agenda !== 'string') {
                deck.agenda = deck.agenda.code;
            }
            if (deck.bannerCards && _.any(deck.bannerCards, (card) => typeof card !== 'string')) {
                deck.bannerCards = _.map(deck.bannerCards, (card) => {
                    return card.code;
                });
            }
            if (
                deck.plotCards &&
                _.any(
                    deck.plotCards,
                    (cardQuantity) => typeof cardQuantity.cardcode === 'undefined'
                )
            ) {
                deck.plotCards = _.map(deck.plotCards, (cardQuantity) => {
                    return { cardcode: cardQuantity.card.code, count: cardQuantity.count };
                });
            }
            if (
                deck.drawCards &&
                _.any(
                    deck.drawCards,
                    (cardQuantity) => typeof cardQuantity.cardcode === 'undefined'
                )
            ) {
                deck.drawCards = _.map(deck.drawCards, (cardQuantity) => {
                    return { cardcode: cardQuantity.card.code, count: cardQuantity.count };
                });
            }
        }

        numberProcessed += _.size(decks);
        console.info('processed', numberProcessed, 'decks');
    }

    db.close();
};

convertDecks();

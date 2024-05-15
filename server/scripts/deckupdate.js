/*eslint no-console:0 */
const monk = require('monk');
const _ = require('underscore');
const ServiceFactory = require('../services/ServiceFactory.js');

let configService = ServiceFactory.configService();
let db = monk(configService.getValue('dbPath'));

let dbDecks = db.get('decks');

const fixBanners = async () => {
    let count = await dbDecks.count({});
    console.info(count, 'decks to process');
    let numberProcessed = 0;
    let chunkSize = 5000;
    let numberFound = 0;

    while (numberProcessed < count) {
        let decks = await dbDecks.find({}, { limit: chunkSize, skip: numberProcessed });
        console.info('loaded', _.size(decks), 'decks');
        for (let deck of decks) {
            if (
                deck.drawCards.some((card) => card.card.text) ||
                deck.plotCards.some((card) => card.card.text) ||
                (deck.agenda && deck.agenda.text) ||
                deck.faction.name
            ) {
                numberFound++;

                for (const drawCard of deck.drawCards) {
                    drawCard.card = { code: drawCard.card.code };
                }

                for (const plotCard of deck.plotCards) {
                    plotCard.card = { code: plotCard.card.code };
                }

                await dbDecks.update(
                    { _id: deck._id },
                    {
                        $set: {
                            plotCards: deck.plotCards,
                            drawCards: deck.drawCards,
                            agenda: deck.agenda ? { code: deck.agenda.code } : undefined,
                            faction: { value: deck.faction.value }
                        }
                    }
                );
            }
        }

        numberProcessed += _.size(decks);
        console.info('processed', numberProcessed, 'decks');
    }

    console.info('found and fixed', numberFound);
    db.close();
};

fixBanners();

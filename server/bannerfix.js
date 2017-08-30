/*eslint no-console:0 */
const monk = require('monk');
const _ = require('underscore');

let db = monk('mongodb://127.0.0.1:27017/throneteki');

let dbDecks = db.get('decks');

const fixBanners = async () => {
    let count = await dbDecks.count({});
    console.info(count, 'decks to process');
    let numberProcessed = 0;
    let chunkSize = 1000;

    while(numberProcessed < count) {
        await dbDecks.find({}, { limit: chunkSize, skip: numberProcessed}).then(decks => {
            console.info('loaded', _.size(decks), 'decks');
            _.each(decks, deck => {
                if(deck.bannerCards) {
                    if(_.any(deck.bannerCards, card => {
                        return !card.code;
                    })) {
                        console.info('found one', deck.name);
                        deck.bannerCards = _.reject(deck.bannerCards, card => {
                            return !card.code;
                        });
                    }
                }
            });

            numberProcessed += _.size(decks);
        });

        console.info('processed', numberProcessed, 'decks');
    }

    db.close();
};

fixBanners();

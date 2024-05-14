/*eslint no-console:0 */
const monk = require('monk');
const _ = require('underscore');

let db = monk('mongodb://127.0.0.1:27017/throneteki');

let dbDecks = db.get('decks');

const fixBanners = async () => {
    let count = await dbDecks.count({});
    console.info(count, 'decks to process');
    let numberProcessed = 0;
    let chunkSize = 5000;

    while (numberProcessed < count) {
        let decks = await dbDecks.find({}, { limit: chunkSize, skip: numberProcessed });
        console.info('loaded', _.size(decks), 'decks');
        for (let deck of decks) {
            if (deck.bannerCards) {
                if (
                    _.any(deck.bannerCards, (card) => {
                        return !card.code;
                    })
                ) {
                    console.info('found one', deck.name);
                    deck.bannerCards = _.reject(deck.bannerCards, (card) => {
                        return !card.code;
                    });

                    await dbDecks.update(
                        { _id: deck._id },
                        {
                            $set: {
                                bannerCards: deck.bannerCards
                            }
                        }
                    );
                }
            }
        }

        numberProcessed += _.size(decks);
        console.info('processed', numberProcessed, 'decks');
    }

    db.close();
};

fixBanners();

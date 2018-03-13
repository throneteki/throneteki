/*eslint no-console:0 */
const fs = require('fs');
const _ = require('underscore');

class JsonCardSource {
    getCards() {
        let files = fs.readdirSync('thronesdb-json-data/pack');
        let totalCards = [];

        _.each(files, file => {
            let cards = JSON.parse(fs.readFileSync('thronesdb-json-data/pack/' + file));

            totalCards = totalCards.concat(cards);
        });

        _.each(totalCards, card => {
            let cardsByName = _.filter(totalCards, filterCard => {
                return filterCard.name === card.name;
            });

            if(cardsByName.length > 1) {
                card.label = card.name + ' (' + card.packCode + ')';
            } else {
                card.label = card.name;
            }
        });
        return totalCards;
    }

    getPacks() {
        return JSON.parse(fs.readFileSync('thronesdb-json-data/packs.json'));
    }
}

module.exports = JsonCardSource;

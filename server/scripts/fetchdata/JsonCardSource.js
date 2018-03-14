/*eslint no-console:0 */
const fs = require('fs');
const _ = require('underscore');

class JsonCardSource {
    constructor() {
        let data = this.loadPackFiles();
        this.packs = data.packs;
        this.cards = data.cards;
    }

    loadPackFiles() {
        let packs = [];
        let cards = [];
        let files = fs.readdirSync('throneteki-json-data/packs');
        for(let file of files) {
            let pack = JSON.parse(fs.readFileSync('throneteki-json-data/packs/' + file));
            for(let card of pack.cards) {
                card.packCode = pack.code;
            }

            packs.push({ cgdbId: pack.cgdbId, code: pack.code, name: pack.name, releaseDate: pack.releaseDate });
            cards = cards.concat(pack.cards);
        }

        this.addLabelToCards(cards);

        return {
            cards: cards,
            packs: packs
        };
    }

    addLabelToCards(cards) {
        for(let card of cards) {
            let cardsByName = _.filter(cards, filterCard => {
                return filterCard.name === card.name;
            });

            if(cardsByName.length > 1) {
                card.label = card.name + ' (' + card.packCode + ')';
            } else {
                card.label = card.name;
            }
        }
    }

    getCards() {
        return this.cards;
    }

    getPacks() {
        return this.packs;
    }
}

module.exports = JsonCardSource;

const fs = require('fs');
const path = require('path');

const {matchCardByNameAndPack} = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../throneteki-json-data/packs');

class DeckBuilder {
    constructor() {
        this.cardsByCode = this.loadCards(PathToSubModulePacks);
        this.cards = Object.values(this.cardsByCode);
    }

    loadCards(directory) {
        let cards = {};

        let jsonPacks = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

        for(let file of jsonPacks) {
            let pack = require(path.join(directory, file));

            for(let card of pack.cards) {
                card.packCode = pack.code;
                cards[card.code] = card;
            }
        }

        return cards;
    }

    buildDeck(faction, cardLabels) {
        let allCards = this.createCardCounts(cardLabels);

        let agendas = allCards.filter(cardCount => cardCount.card.type === 'agenda').map(cardCount => cardCount.card);
        let agenda = agendas[0];
        let bannerCards = [];

        if(agendas.length > 1) {
            // Assume multi-agenda decks are Alliance
            agenda = agendas.find(card => card.name === 'Alliance');
            bannerCards = agendas.filter(card => card.name !== 'Alliance');
        }

        return {
            faction: { value: faction },
            agenda: agenda,
            bannerCards: bannerCards,
            drawCards: allCards.filter(cardCount => ['character', 'location', 'attachment', 'event'].includes(cardCount.card.type)),
            plotCards: allCards.filter(cardCount => cardCount.card.type === 'plot')
        };
    }

    createCardCounts(cardLabels) {
        let cardCounts = {};
        for(let label of cardLabels) {
            let cardName = label;
            let count = 1;
            if(typeof label !== 'string') {
                cardName = label.name;
                count = label.count;
            }

            let cardData = this.getCard(cardName);
            if(cardCounts[cardData.code]) {
                cardCounts[cardData.code].count += count;
            } else {
                cardCounts[cardData.code] = {
                    count: count,
                    card: cardData
                };
            }
        }
        return Object.values(cardCounts);
    }

    getCard(codeOrLabelOrName) {
        if(this.cardsByCode[codeOrLabelOrName]) {
            return this.cardsByCode[codeOrLabelOrName];
        }

        let cardsByName = this.cards.filter(matchCardByNameAndPack(codeOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${codeOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            let matchingLabels = cardsByName.map(card => `${card.name} (${card.packCode})`).join('\n');
            throw new Error(`Multiple cards match the name ${codeOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;

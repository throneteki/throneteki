const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const {matchCardByNameAndPack} = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../throneteki-json-data/packs');

class DeckBuilder {
    constructor() {
        this.cardsByCode = this.loadCards(PathToSubModulePacks);
    }

    loadCards(directory) {
        var cards = {};

        var jsonPacks = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

        _.each(jsonPacks, file => {
            var pack = require(path.join(directory, file));

            _.each(pack.cards, card => {
                card.packCode = pack.code;
                cards[card.code] = card;
            });
        });

        return cards;
    }

    buildDeck(faction, cardLabels) {
        var cardCountsByCode = {};
        _.each(cardLabels, label => {
            var cardData = this.getCard(label);
            if(cardCountsByCode[cardData.code]) {
                cardCountsByCode[cardData.code].count++;
            } else {
                cardCountsByCode[cardData.code] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        var agenda;
        var agendaCount = _.find(cardCountsByCode, cardCount => cardCount.card.type === 'agenda');
        if(agendaCount) {
            agenda = agendaCount.card;
        }

        const cardCountValues = Object.values(cardCountsByCode);

        return {
            faction: { value: faction },
            agenda: agenda,
            drawCards: cardCountValues.filter(cardCount => ['character', 'location', 'attachment', 'event'].includes(cardCount.card.type)),
            plotCards: cardCountValues.filter(cardCount => cardCount.card.type === 'plot')
        };
    }

    getCard(codeOrLabelOrName) {
        if(this.cardsByCode[codeOrLabelOrName]) {
            return this.cardsByCode[codeOrLabelOrName];
        }

        var cardsByName = Object.values(this.cardsByCode).filter(matchCardByNameAndPack(codeOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${codeOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            var matchingLabels = _.map(cardsByName, card => `${card.name} (${card.packCode})`).join('\n');
            throw new Error(`Multiple cards match the name ${codeOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;

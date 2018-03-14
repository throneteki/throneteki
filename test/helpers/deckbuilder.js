const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const {matchCardByNameAndPack} = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../throneteki-json-data/packs');

class DeckBuilder {
    constructor() {
        this.cards = this.loadCards(PathToSubModulePacks);
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
        var cardCounts = {};
        _.each(cardLabels, label => {
            var cardData = this.getCard(label);
            if(cardCounts[cardData.code]) {
                cardCounts[cardData.code].count++;
            } else {
                cardCounts[cardData.code] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        var agenda;
        var agendaCount = _.find(cardCounts, cardCount => cardCount.card.type === 'agenda');
        if(agendaCount) {
            agenda = agendaCount.card;
        }

        return {
            faction: { value: faction },
            agenda: agenda,
            drawCards: _.filter(cardCounts, cardCount => ['character', 'location', 'attachment', 'event'].includes(cardCount.card.type)),
            plotCards: _.filter(cardCounts, cardCount => cardCount.card.type === 'plot')
        };
    }

    getCard(codeOrLabelOrName) {
        if(this.cards[codeOrLabelOrName]) {
            return this.cards[codeOrLabelOrName];
        }

        var cardsByName = _.filter(this.cards, matchCardByNameAndPack(codeOrLabelOrName));

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

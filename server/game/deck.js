const _ = require('underscore');

const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const PlotCard = require('./plotcard.js');
const AgendaCard = require('./agendacard.js');
const Factions = require('./Factions');

class Deck {
    constructor(data) {
        this.data = data;
    }

    createFactionCard(player) {
        if(this.data.faction) {
            let factionData = Factions.find(faction => faction.value === this.data.faction.value);
            return new DrawCard(player, {
                code: this.data.faction.value,
                type: 'faction',
                faction: this.data.faction.value,
                name: factionData && factionData.name,
                label: factionData && factionData.name
            });
        }

        return new DrawCard(player, { type: 'faction' });
    }

    createAgendaCard(player) {
        if(this.data.agenda) {
            return this.createCard(AgendaCard, player, this.data.agenda);
        }

        return;
    }

    prepare(player) {
        var result = {
            drawCards: [],
            plotCards: []
        };

        this.eachRepeatedCard(this.data.drawCards, cardData => {
            if(['attachment', 'character', 'event', 'location'].includes(cardData.type)) {
                var drawCard = this.createCard(DrawCard, player, cardData);
                drawCard.moveTo('draw deck');
                result.drawCards.push(drawCard);
            }
        });

        this.eachRepeatedCard(this.data.plotCards, cardData => {
            if(cardData.type === 'plot') {
                var plotCard = this.createCard(PlotCard, player, cardData);
                plotCard.moveTo('plot deck');
                result.plotCards.push(plotCard);
            }
        });

        result.faction = this.createFactionCard(player);
        result.faction.moveTo('faction');

        result.allCards = [result.faction].concat(result.drawCards).concat(result.plotCards);

        result.agenda = this.createAgendaCard(player);
        if(result.agenda) {
            result.agenda.moveTo('agenda');
            result.allCards.push(result.agenda);
        }

        result.bannerCards = _.map(this.data.bannerCards, card => this.createCard(AgendaCard, player, card));

        return result;
    }

    eachRepeatedCard(cards, func) {
        _.each(cards, cardEntry => {
            for(var i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        });
    }

    createCard(baseClass, player, cardData) {
        var cardClass = cards[cardData.code] || baseClass;
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;

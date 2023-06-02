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
            let factionData = Factions.find(faction => faction.value === this.data.faction.code);
            return new DrawCard(player, {
                code: this.data.faction.code,
                type: 'faction',
                faction: this.data.faction.code,
                name: factionData && factionData.name,
                label: factionData && factionData.name
            });
        }

        return new DrawCard(player, { type: 'faction' });
    }

    createAgendaCard(player) {
        if(this.data.agenda) {
            return this.createCardForType(AgendaCard, player, this.data.agenda);
        }

        return;
    }

    isPlotCard(cardData) {
        return cardData.type === 'plot';
    }

    isDrawCard(cardData) {
        return ['attachment', 'character', 'event', 'location'].includes(cardData.type);
    }

    prepare(player) {
        let result = {
            drawCards: [],
            plotCards: []
        };

        this.eachRepeatedCard(this.data.drawCards || [], cardData => {
            if(this.isDrawCard(cardData)) {
                var drawCard = this.createCardForType(DrawCard, player, cardData);
                drawCard.moveTo('draw deck');
                result.drawCards.push(drawCard);
            }
        });

        this.eachRepeatedCard(this.data.plotCards || [], cardData => {
            if(this.isPlotCard(cardData)) {
                var plotCard = this.createCardForType(PlotCard, player, cardData);
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

        result.bannerCards = (this.data.bannerCards || []).map(card => this.createCardForType(AgendaCard, player, card));

        for(let card of result.bannerCards) {
            card.moveTo('agenda');
            result.allCards.push(card);
        }

        return result;
    }

    eachRepeatedCard(cards, func) {
        for(let cardEntry of cards) {
            for(var i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        }
    }

    createCardForType(baseClass, player, cardData) {
        let cardClass = cards[cardData.code] || baseClass;
        if(cardClass.cardData) {
            cardData = Object.assign({}, cardData, cardClass.cardData);
        }
        return new cardClass(player, cardData);
    }

    createCard(player, cardData) {
        if(this.isDrawCard(cardData)) {
            var drawCard = this.createCardForType(DrawCard, player, cardData);
            drawCard.moveTo('draw deck');
            return drawCard;
        }

        if(this.isPlotCard(cardData)) {
            var plotCard = this.createCardForType(PlotCard, player, cardData);
            plotCard.moveTo('plot deck');
            return plotCard;
        }
    }
}

module.exports = Deck;

const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class ThePowerOfWealth extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledOrPlayedCardCostEachRound(1, card => card.isFaction(this.controller.getFaction()))
        });
    }

    onDecksPrepared() {
        let factionsInDecks = [];

        this.controller.allCards.each(card => {
            if(!factionsInDecks.includes(card.getPrintedFaction())) {
                factionsInDecks.push(card.getPrintedFaction());
            }
        });

        let factionToAnnounce = _.filter(factionsInDecks, faction => faction !== this.controller.getFaction() && faction !== 'neutral');

        if(factionToAnnounce.length > 1) {
            this.game.addMessage('{0} has included more than the maximum allowed number of factions for {1} in their draw and/or plot deck',
                this.controller, this);
            return;
        }

        if(_.isEmpty(factionToAnnounce)) {
            //Don't print any message: allows the player to bluff any faction
            return;            
        }

        this.game.addMessage('{0} names {1} as their faction for {2}', this.controller, factionToAnnounce, this);
    }
}

ThePowerOfWealth.code = '00001';

module.exports = ThePowerOfWealth;

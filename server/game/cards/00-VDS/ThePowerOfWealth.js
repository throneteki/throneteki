const AgendaCard = require('../../agendacard.js');

class ThePowerOfWealth extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledOrPlayedCardCostEachRound(1, (card) =>
                card.isFaction(this.controller.getFaction())
            )
        });
    }

    onDecksPrepared() {
        let factionsInDecks = [];

        for (const card of this.game.allCards) {
            if (card.owner === this.owner && !factionsInDecks.includes(card.getPrintedFaction())) {
                factionsInDecks.push(card.getPrintedFaction());
            }
        }

        let factionToAnnounce = factionsInDecks.filter(
            (faction) => faction !== this.controller.getFaction() && faction !== 'neutral'
        );
        let message = '{0} names {1} as their {2} for {3}';

        if (factionToAnnounce.length > 1) {
            message += ' (this exceeds the maximum allowed number of factions)';
        }

        if (factionToAnnounce.length === 0) {
            //Don't print any message: allows the player to bluff any faction
            return;
        }

        this.game.addMessage(
            message,
            this.controller,
            factionToAnnounce,
            factionToAnnounce.length > 1 ? 'factions' : 'faction',
            this
        );
    }
}

ThePowerOfWealth.code = '00001';

module.exports = ThePowerOfWealth;

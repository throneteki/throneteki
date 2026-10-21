import AgendaCard from '../../agendacard.js';

class ThePowerOfWealth extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    // The Power of Wealth (00001)
    // When you announce The Power of Wealth as your agenda, name 1 faction. You may include cards
    // from that faction in your draw deck and plot deck.
    // Reduce the cost of the first in-faction card you marshal or play each round by 1.
    // Draft format only.
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

export default ThePowerOfWealth;

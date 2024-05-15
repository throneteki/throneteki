import AgendaCard from '../../agendacard.js';

class Treaty extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card then discard card',
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to draw 1 card',
                    this.controller,
                    this
                );

                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'hand' && card.controller === this.controller,
                    onSelect: (player, card) => this.cardSelected(player, card)
                });
            }
        });
    }

    cardSelected(player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} then discards {1} for {2}', this.controller, card, this);
        return true;
    }

    onDecksPrepared() {
        let factionsInDecks = [];

        for (const card of this.game.allCards) {
            if (card.owner === this.owner && !factionsInDecks.includes(card.getPrintedFaction())) {
                factionsInDecks.push(card.getPrintedFaction());
            }
        }

        let factionsToAnnounce = factionsInDecks.filter(
            (faction) => faction !== this.controller.getFaction() && faction !== 'neutral'
        );
        let message = '{0} names {1} as their {2} for {3}';

        if (factionsToAnnounce.length > 2) {
            message += ' (this exceeds the maximum allowed number of factions)';
        }

        if (factionsToAnnounce.length === 0) {
            //Don't print any message: allows the player to bluff any faction
            return;
        }

        this.game.addMessage(
            message,
            this.controller,
            factionsToAnnounce,
            factionsToAnnounce.length > 1 ? 'factions' : 'faction',
            this
        );
    }
}

Treaty.code = '00003';

export default Treaty;

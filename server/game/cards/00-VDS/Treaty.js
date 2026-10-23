import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class Treaty extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    // Treaty (00003)
    // When you announce Treaty as your agenda, name 2 factions. You may include cards from those
    // factions in your draw deck and plot deck.
    // Action: Kneel your faction card to draw 1 card. Then, choose and discard 1 card from your
    // hand.
    // Draft format only.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card then discard card',
            cost: ability.costs.kneelFactionCard(),
            message: '{player} uses {source} and kneels their faction card to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1
            })).then({
                message: 'Then {player} discards a card from their hand for {source}',
                gameAction: GameActions.chooseCards({
                    title: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'hand' && card.controller === context.player,
                    gameAction: (card) => GameActions.discardCard({ card })
                })
            })
        });
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

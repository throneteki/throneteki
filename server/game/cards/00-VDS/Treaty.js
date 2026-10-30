import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class Treaty extends AgendaCard {
    // Treaty (00003)
    // When you announce Treaty as your agenda, name 2 factions. You may include cards from those
    // factions in your draw deck and plot deck.
    // Action: Kneel your faction card to draw 1 card. Then, choose and discard 1 card from your
    // hand.
    // Draft format only.
    setupCardAbilities(ability) {
        this.afterAgendasAnnounced({
            gameAction: GameActions.nameFaction({ count: 2 })
        });

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
}

Treaty.code = '00003';

export default Treaty;

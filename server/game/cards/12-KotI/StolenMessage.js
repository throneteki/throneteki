import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class StolenMessage extends PlotCard {
    // Stolen Message (12050)
    // Each opponent plays with the top card of his or her deck revealed.
    // Action: Pay 1 gold to place the top card of an opponent's deck on the bottom of that player's
    // deck. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.revealTopCards(1)
        });

        this.action({
            title: 'Place top card on bottom',
            cost: ability.costs.payGold(1),
            chooseOpponent: (opponent) => opponent.drawDeck.length > 1,
            limit: ability.limit.perRound(3),
            message:
                "{player} uses {source} to place the top card of {opponent}'s deck on the bottom of their deck",
            gameAction: GameActions.placeCard((context) => ({
                card: context.opponent.drawDeck[0],
                location: 'draw deck',
                bottom: true
            }))
        });
    }
}

StolenMessage.code = '12050';

export default StolenMessage;

import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class StolenMessage extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.revealTopCards(1)
        });

        this.action({
            title: 'Place top card on bottom',
            cost: ability.costs.payGold(1),
            chooseOpponent: true,
            limit: ability.limit.perRound(3),
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to place the top card of {2}'s deck on the bottom of their deck",
                    context.player,
                    this,
                    context.opponent
                );
                this.game.resolveGameAction(
                    GameActions.placeCard((context) => ({
                        card: context.opponent.drawDeck[0],
                        location: 'draw deck',
                        bottom: true
                    })),
                    context
                );
            }
        });
    }
}

StolenMessage.code = '12050';

export default StolenMessage;

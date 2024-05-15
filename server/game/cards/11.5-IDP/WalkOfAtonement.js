import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class WalkOfAtonement extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard cards and draw',
            phase: 'dominance',
            condition: () => this.controller.canDraw() || this.anyOpponentHasCards(this.controller),
            cost: ability.costs.discardAnyPower((card) => card.getType() === 'character'),
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} and discards {2} power from {3} to discard {4} from each opponent and draw {4}',
                    context.player,
                    this,
                    context.xValue,
                    context.costs.discardPower,
                    TextHelper.count(context.xValue, 'card')
                );

                for (let opponent of this.game.getOpponents(context.player)) {
                    opponent.discardAtRandom(context.xValue);
                }

                context.player.drawCardsToHand(context.xValue);
            }
        });
    }

    anyOpponentHasCards(player) {
        let opponents = this.game.getOpponents(player);
        return opponents.some((opponent) => opponent.hand.length > 0);
    }
}

WalkOfAtonement.code = '11090';

export default WalkOfAtonement;

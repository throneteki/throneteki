import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class Meereen extends DrawCard {
    // Meereen (17133)
    // Action: Kneel Meereen and discard 1 card from your hand to place each card in your hand
    // facedown under Meereen and draw 3 cards. At the end of the phase, or if Meereen leaves play,
    // discard your hand and return each card you placed under Meereen to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Place hand facedown and draw 3',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) => event.card === this,
                        onPhaseEnded: () => true
                    },
                    targetController: 'any',
                    match: (player) => player === context.player,
                    effect: ability.effects.removeCardsFromHand()
                }));

                let numDrawn = context.player.drawCardsToHand(3).length;
                this.game.addMessage(
                    '{0} kneels {1} and discards 1 card from their hand to place their hand facedown under {1} and draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numDrawn, 'card')
                );
            }
        });
    }
}

Meereen.code = '17133';

export default Meereen;

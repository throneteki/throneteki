import GameActions from '../../GameActions/index.js';
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
            message: {
                format: '{player} kneels {source} and discards 1 card from their hand to place their hand facedown under {source} and draw {textHelperPlayer}',
                args: {
                    textHelperPlayer: (context) =>
                        TextHelper.count(context.player.drawCardsToHand(3).length, 'card')
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onCardLeftPlay: (event) => event.card === context.source,
                    onPhaseEnded: () => true
                },
                targetController: 'any',
                match: (player) => player === context.player,
                effect: ability.effects.removeCardsFromHand()
            }))
        });
    }
}

Meereen.code = '17133';

export default Meereen;

import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Meereen extends DrawCard {
    // Meereen (11034)
    // Action: Kneel Meereen to place each card in your hand facedown under Meereen and draw 3
    // cards. At the end of the phase, or if Meereen leaves play, discard your hand and return each
    // card you placed under Meereen to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Place hand facedown and draw 3',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to place their hand facedown under {source}',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'custom',
                    until: {
                        onCardLeftPlay: (event) => event.card === context.source,
                        onPhaseEnded: () => true
                    },
                    targetController: 'any',
                    match: (player) => player === context.player,
                    effect: ability.effects.removeCardsFromHand()
                }))
            ]).then({
                message: 'Then {player} draws 3 cards',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: 3
                }))
            })
        });
    }
}

Meereen.code = '11034';

export default Meereen;

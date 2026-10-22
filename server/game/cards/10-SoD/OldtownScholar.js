import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldtownScholar extends DrawCard {
    // Oldtown Scholar (10041)
    // Reaction: After an opponent draws 1 or more cards, if it is not the draw phase, kneel Oldtown
    // Scholar to draw that many cards.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardsDrawn: (event, context) =>
                    event.player !== context.source.controller &&
                    context.source.controller.canDraw() &&
                    context.game.currentPhase !== 'draw'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to draw {amount} cards',
                args: { amount: (context) => context.event.cards.length }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.event.cards.length
            }))
        });
    }
}

OldtownScholar.code = '10041';

export default OldtownScholar;

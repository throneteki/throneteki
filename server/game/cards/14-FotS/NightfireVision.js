import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NightfireVision extends DrawCard {
    // Nightfire Visions (14024)
    // Play only if you control a R'hllor character.
    // Taxation Action: Name a Trait. If an opponent reveals a plot card with that Trait during the
    // next plot phase, draw 3 cards.
    setupCardAbilities() {
        this.action({
            phase: 'taxation',
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasTrait("R'hllor")
                ),
            message: '{player} plays {source} to name a trait',
            gameAction: GameActions.nameTrait({
                message: '{player} names the {trait} trait',
                gameAction: GameActions.delayedEffect({
                    duration: 'custom',
                    when: {
                        onPlotsRevealed: (event, context) =>
                            context.game.currentPhase === 'plot' &&
                            event.plots.some(
                                (plot) =>
                                    plot.controller !== context.player &&
                                    plot.hasTrait(context.namedTrait)
                            )
                    },
                    until: {
                        onPhaseEnded: (event) => event.phase === 'plot'
                    },
                    message: {
                        format: '{player} draws 3 cards for {source} as a plot with the {trait} trait was revealed',
                        args: { trait: (context) => context.namedTrait }
                    },
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 3
                    }))
                })
            })
        });
    }
}

NightfireVision.code = '14024';

export default NightfireVision;

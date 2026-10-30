import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AheadOfTheTide extends DrawCard {
    // Ahead of the Tide (03028)
    // Interrupt: When you compare initiative, your revealed plot card gets +3 initiative until the
    // end of the phase. If you win initiative this phase, draw 1 card.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCompareInitiative: () => true
            },
            message: '{player} plays {source} to increase initiative on their plot by 3',
            gameAction: GameActions.simultaneously((context) => [
                GameActions.lastingEffect(() => ({
                    duration: 'untilEndOfPhase',
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyInitiative(3)
                })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfPhase',
                    when: {
                        onInitiativeDetermined: (event) => event.winner === context.player
                    },
                    message: '{player} draws 1 card for winning initiative',
                    gameAction: GameActions.drawCards({ player: context.player, amount: 1 })
                })
            ])
        });
    }
}

AheadOfTheTide.code = '03028';

export default AheadOfTheTide;

import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CompelledByTheKing extends DrawCard {
    // Compelled by the King (00009)
    // Reaction: After the dominance phase begins, choose and stand a character you control. If you
    // win dominance this phase, that character gains 1 power.
    // Draft format only.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'dominance'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.player,
                gameAction: 'stand'
            },
            message: '{player} plays {source} to stand {target}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfPhase',
                    when: {
                        onDominanceDetermined: (event, context) => event.winner === context.player
                    },
                    message: '{player} wins dominance and has {target} gain 1 power for {source}',
                    gameAction: GameActions.gainPower((context) => ({
                        card: context.target,
                        amount: 1
                    }))
                })
            ])
        });
    }
}

CompelledByTheKing.code = '00009';

export default CompelledByTheKing;

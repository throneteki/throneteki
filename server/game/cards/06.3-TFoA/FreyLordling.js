import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class FreyLordling extends DrawCard {
    // Frey Lordling (06057)
    // Reaction: After you initiate a challenge, Frey Lordling gets +1 STR until the end of the
    // phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.source.controller
            },
            message: '{player} uses {source} to give {source} +1 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.modifyStrength(1)
            }))
        });
    }
}

FreyLordling.code = '06057';

export default FreyLordling;

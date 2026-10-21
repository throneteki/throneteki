import DrawCard from '../../drawcard.js';

class FreyLordling extends DrawCard {
    // Frey Lordling (06057)
    // Reaction: After you initiate a challenge, Frey Lordling gets +1 STR until the end of the
    // phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event) => event.challenge.attackingPlayer === this.controller
            },
            handler: () => {
                this.untilEndOfPhase((ability) => ({
                    match: this,
                    effect: ability.effects.modifyStrength(1)
                }));

                this.game.addMessage(
                    '{0} uses {1} to give {1} +1 STR until the end of the phase',
                    this.controller,
                    this
                );
            }
        });
    }
}

FreyLordling.code = '06057';

export default FreyLordling;

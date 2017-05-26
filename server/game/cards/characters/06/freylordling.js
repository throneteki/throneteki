const DrawCard = require('../../../drawcard.js');

class FreyLordling extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallenge: (event, challenge) => challenge.attackingPlayer === this.controller
            },
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.modifyStrength(1)
                }));

                this.game.addMessage('{0} uses {1} to give {1} +1 STR until the end of the phase', 
                                      this.controller, this);
            }
        });
    }
}

FreyLordling.code = '06057';

module.exports = FreyLordling;

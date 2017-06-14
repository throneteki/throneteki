const DrawCard = require('../../../drawcard.js');

class Ghost extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.isStealthSource(this)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to make {2} unable to be declared as a defender until the end of the phase', 
                                      this.controller, this, context.event.challenge.getStealthTargetFor(this));

                this.untilEndOfPhase(ability => ({
                    match: context.event.challenge.getStealthTargetFor(this),
                    effect: ability.effects.cannotBeDeclaredAsDefender()
                }));
            }
        });
    }
}

Ghost.code = '01123';

module.exports = Ghost;

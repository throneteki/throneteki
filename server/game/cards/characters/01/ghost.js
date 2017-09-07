const DrawCard = require('../../../drawcard.js');

class Ghost extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: event => event.source === this
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to make {2} unable to be declared as a defender until the end of the phase',
                    this.controller, this, context.event.target);

                this.untilEndOfPhase(ability => ({
                    match: context.event.target,
                    effect: ability.effects.cannotBeDeclaredAsDefender()
                }));
            }
        });
    }
}

Ghost.code = '01123';

module.exports = Ghost;

const DrawCard = require('../../../drawcard.js');

class WolvesOfTheNorth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.isStealthSource(this)
            },
            handler: context => {
                let target = context.event.challenge.getStealthTargetFor(this);
                let strDecrease = -this.controller.getNumberOfCardsInPlay(c => c.hasTrait('Direwolf'));

                this.untilEndOfPhase(ability => ({
                    match: target,
                    effect: ability.effects.modifyStrength(strDecrease)
                }));

                this.game.addMessage('{0} uses {1} to give {2} {3}STR until the end of the phase', 
                                      this.controller, this, target, strDecrease);
            }
        });
    }
}

WolvesOfTheNorth.code = '03006';

module.exports = WolvesOfTheNorth;

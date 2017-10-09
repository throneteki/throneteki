const DrawCard = require('../../drawcard.js');

class TyeneSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => (
                    challenge.challengeType === 'intrigue' &&
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this)
                )
            },
            target: {
                type: 'select',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.hasIcon('intrigue')
            },
            handler: context => {
                this.atEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.poison
                }));
            }
        });
    }
}

TyeneSand.code = '02115';

module.exports = TyeneSand;

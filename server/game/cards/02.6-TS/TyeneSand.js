const DrawCard = require('../../drawcard.js');

class TyeneSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this)
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

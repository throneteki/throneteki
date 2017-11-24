const DrawCard = require('../../drawcard.js');

class DaarioNaharis extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.isAttacking(this)
            },
            target: {
                cardCondition: card => card.location === 'play area' && card !== this && (card.kneeled || card.controller !== this.controller) &&
                                       (card.hasTrait('Ally') || card.hasTrait('Companion') || card.hasTrait('Mercenary'))
            },
            handler: context => {
                if(context.target.kneeled) {
                    context.target.controller.standCard(context.target);
                }

                if(context.target.controller !== this.controller) {
                    this.untilEndOfPhase(ability => ({
                        match: context.target,
                        effect: ability.effects.takeControl(this.controller)
                    }));
                }

                this.game.addMessage('{0} uses {1} to stand and take control of {2}', context.player, this, context.target);
            }
        });
    }
}

DaarioNaharis.code = '08014';

module.exports = DaarioNaharis;

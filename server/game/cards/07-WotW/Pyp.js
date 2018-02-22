const DrawCard = require('../../drawcard.js');

class Pyp extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.isAttacking(this)
            },
            target: {
                cardCondition: card => (
                    card.location === 'play area' &&
                    card !== this &&
                    this.game.currentChallenge.isAttacking(card) &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character')
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('Insight')
                }));

                this.game.addMessage('{0} uses {1} to have {2} gain insight until the end of the phase',
                    this.controller, this, context.target);
            }
        });
    }
}

Pyp.code = '07011';

module.exports = Pyp;

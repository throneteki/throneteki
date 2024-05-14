const DrawCard = require('../../drawcard.js');

class ThrowingAxe extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent)
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isDefending(),
                gameAction: 'kill'
            },
            handler: (context) => {
                context.target.controller.killCharacter(context.target);
                this.game.addMessage(
                    '{0} sacrifices {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

ThrowingAxe.code = '01077';

module.exports = ThrowingAxe;

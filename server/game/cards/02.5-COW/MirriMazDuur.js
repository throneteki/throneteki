const DrawCard = require('../../drawcard.js');

class MirriMazDuur extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this) &&
                    event.challenge.attackers.length === 1
                )
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.controller === this.game.currentChallenge.loser,
                gameAction: 'kill'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to kill {2} instead of normal claim effects', context.player, this, context.target);

                context.replaceHandler(() => {
                    this.game.killCharacter(context.target);
                });
            }
        });
    }
}

MirriMazDuur.code = '02093';

module.exports = MirriMazDuur;

const DrawCard = require('../../../drawcard.js');

class ScalingTheWall extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.attackingPlayer === this.controller &&
                    this.hasAttackingWildling()
                )
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: card => card.getType() === 'location' && !card.isLimited()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to return {2} to it\'s owners hand', context.player, this, context.target);
                context.target.owner.returnCardToHand(context.target);
            }
        });
    }

    hasAttackingWildling() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isAttacking(card) && card.hasTrait('Wildling') && card.getType() === 'character');
    }
}

ScalingTheWall.code = '07044';

module.exports = ScalingTheWall;

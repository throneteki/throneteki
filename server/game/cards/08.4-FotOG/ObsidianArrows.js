const DrawCard = require('../../drawcard.js');

class ObsidianArrows extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give defending character -3 STR',
            limit: ability.limit.perChallenge(1),
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this.parent),
            cost: ability.costs.moveTokenFromSelf('gold', 1, card => this.game.currentChallenge.isDefending(card)),
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.costs.moveTokenFromSelf,
                    effect: ability.effects.modifyStrength(-3)
                }));

                this.game.addMessage('{0} moves 1 gold from {1} to {2} to give {2} -3 STR until the end of the challenge',
                    context.player, this, context.costs.moveTokenFromSelf);
            }
        });
    }
}

ObsidianArrows.code = '08066';

module.exports = ObsidianArrows;

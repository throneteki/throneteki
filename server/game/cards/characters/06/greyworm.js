const DrawCard = require('../../../drawcard.js');

class GreyWorm extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character -3 STR',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.getType() === 'character' && 
                    this.game.currentChallenge.isDefending(card))
            },
            limit: ability.limit.perChallenge(1),
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(-3)
                }));

                this.game.addMessage('{0} uses {1} to give {2} -3 STR until the end of the challenge', 
                    context.player, this, context.target);
            }
        });
    }
}

GreyWorm.code = '06053';

module.exports = GreyWorm;

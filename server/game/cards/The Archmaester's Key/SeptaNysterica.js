const DrawCard = require('../../../drawcard.js');

class SeptaNysterica extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.getType() === 'character' && card.location === 'play area' &&
                                       this.game.currentChallenge.isAttacking(card) && card.getStrength() <= 4
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} kneels {1} to stand and remove {2} from the challenge',
                    this.controller, this, context.target);
            }
        });
    }
}

SeptaNysterica.code = '08004';

module.exports = SeptaNysterica;

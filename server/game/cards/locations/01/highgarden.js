const DrawCard = require('../../../drawcard.js');

class Highgarden extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            condition: () => this.game.currentChallenge,
            phase: 'challenge',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.payGold(1)
            ],
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.getType() === 'character' && card.location === 'play area' &&
                                       this.game.currentChallenge.isAttacking(card)
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} kneels {1} and pays 1 gold to stand and remove {2} from the challenge',
                    this.controller, this, context.target);
            }
        });
    }
}

Highgarden.code = '01192';

module.exports = Highgarden;

const DrawCard = require('../../../drawcard.js');

class WinterfellArcheryRange extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'military',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => this.game.currentChallenge.isParticipating(card) && card.getType() === 'character' &&
                                       card.getStrength() <= 3
            },
            handler: context => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} kneels {1} to remove {2} from the challenge', this.controller, this, context.target);
            }
        });
    }
}

WinterfellArcheryRange.code = '06062';

module.exports = WinterfellArcheryRange;

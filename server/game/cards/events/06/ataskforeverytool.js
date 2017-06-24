const DrawCard = require('../../../drawcard.js');

class ATaskForEveryTool extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select character',
                cardCondition: card => card.location === 'hand' && card.controller === this.controller && 
                                       card.getType() === 'character' && card.isFaction('lannister') && card.getStrength(true) <= 2
            },
            handler: context => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage('{0} plays {1} to put {2} into play from their hand', this.controller, this, context.target);
            }
        });
    }
}

ATaskForEveryTool.code = '06090';

module.exports = ATaskForEveryTool;

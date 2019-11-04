const DrawCard = require('../../drawcard.js');

class CageOfRavens extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Steward' });
        this.action({
            title: 'Put card into play',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.location === 'hand' && card.controller === this.controller &&
                                       card.getPrintedCost() <= 1 && this.controller.canPutIntoPlay(card)
            },
            handler: context => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, context.target);
            }
        });
    }
}

CageOfRavens.code = '15034';

module.exports = CageOfRavens;

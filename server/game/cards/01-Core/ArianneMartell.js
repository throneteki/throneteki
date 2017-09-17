const DrawCard = require('../../drawcard.js');

class ArianneMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: card => card.location === 'hand' && card.controller === this.controller &&
                                       card.getCost() <= 5 && card.getType() === 'character' && this.controller.canPutIntoPlay(card)
            },
            handler: context => {
                context.player.putIntoPlay(context.target);

                if(context.target.name === this.name) {
                    this.game.addMessage('{0} uses {1} to put a dupe of herself into play', this.controller, this);
                    return;
                }

                this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, context.target);
                context.player.returnCardToHand(this, false);
                this.game.addMessage('{0} then returns {1} to their hand', this.controller, this);
            }
        });
    }
}

ArianneMartell.code = '01104';

module.exports = ArianneMartell;

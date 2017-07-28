const DrawCard = require('../../../drawcard.js');

class Needle extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.interrupt({
            when: {
                onSacrificed: event => event.card === this.parent
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.skipHandler();
                this.game.addMessage('{0} sacrifices {1} to return {2} to their hand', this.controller, this, context.event.card);
                this.controller.returnCardToHand(context.event.card, false);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('stark')) {
            return false;
        }
        
        return super.canAttach(player, card);
    }
}

Needle.code = '03020';

module.exports = Needle;

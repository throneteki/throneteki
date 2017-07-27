const DrawCard = require('../../../drawcard.js');

class Needle extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.interrupt({
            when: {
                onSacrificed: event => {
                    if(event.card === this.parent) {
                        this.parentCard = this.parent;
                        return true;
                    }
                }
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.skipHandler();
                this.game.addMessage('{0} sacrifices {1} to return {2} to their hand', this.controller, this, this.parentCard);
                this.controller.returnCardToHand(this.parentCard, false);
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

const DrawCard = require('../../drawcard.js');

class Patience extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return parent to hand',
            phase: 'challenge',
            handler: context => {
                this.parent.owner.returnCardToHand(this.parent);
                this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand',
                    context.player, this, this.parent, this.parent.owner);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.controller !== this.controller) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Patience.code = '10020';

module.exports = Patience;

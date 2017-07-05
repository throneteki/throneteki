const DrawCard = require('../../../drawcard.js');

class ImprovedFortifications extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardLeftPlay: event => event.card === this.parent
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.event.cancel();
                this.game.addMessage('{0} sacrifices {1} to save {2}', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'location') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

ImprovedFortifications.code = '06066';

module.exports = ImprovedFortifications;

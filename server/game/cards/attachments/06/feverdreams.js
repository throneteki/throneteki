const DrawCard = require('../../../drawcard.js');

class FeverDreams extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: (event, player, card) => card === this.parent
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                this.controller.drawCardsToHand(2);
                this.game.addMessage('{0} discards a gold from {1} to draw 2 cards', this.controller, this);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.controller === this.controller) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

FeverDreams.code = '06050';

module.exports = FeverDreams;

const DrawCard = require('../../drawcard.js');

class AeronDamphair extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.card.hasTrait('drowned god') && event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }
}

AeronDamphair.code = '12005';

module.exports = AeronDamphair;

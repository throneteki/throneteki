const DrawCard = require('../../drawcard.js');

class SerBalonSwann extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    !event.card.isFaction('lannister') &&
                    event.card.hasTrait('knight') &&
                    event.card.getType() === 'character' &&
                    this.controller.canGainGold()
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                let gold = this.game.addGold(context.player, 2);
                this.game.addMessage('{0} uses {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

SerBalonSwann.code = '08069';

module.exports = SerBalonSwann;

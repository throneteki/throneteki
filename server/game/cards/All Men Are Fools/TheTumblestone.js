const DrawCard = require('../../../drawcard.js');

class TheTumblestone extends DrawCard {
    setupCardAbilities(ability) {  
        this.reaction({
            when: {
                // TODO: Currently has false positive when power is moved to a character, should only trigger on 'gains'
                onCardPowerChanged: event => (
                    event.power > 0 &&
                    event.card.getType() === 'character' &&
                    event.card.hasTrait('House Tully') &&
                    event.card.kneeled
                )
            },
            cost: ability.costs.discardGold(),
            handler: context => {
                let standCard = context.event.card;
                standCard.controller.standCard(standCard);
                this.game.addMessage('{0} discards 1 gold from {1} to stand {2}', this.controller, this, standCard);
            }
        });
    }
}

TheTumblestone.code = '06002';

module.exports = TheTumblestone;

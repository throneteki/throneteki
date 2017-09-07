const DrawCard = require('../../../drawcard.js');

class TheHightower extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.isFaction('tyrell') && event.card.getType() === 'character' &&
                                           event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.addGold(this.controller, 1);
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to gain 1 gold and draw 1 card', this.controller, this);
            }
        });
    }
}

TheHightower.code = '09017';

module.exports = TheHightower;

const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class LionGate extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: () => this.controller.shadows.length >= 2,
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} sacrifices {1} to draw {2}',
                    this.controller, this, TextHelper.count(cards, 'card'));
            }
        });
    }
}

LionGate.code = '13010';

module.exports = LionGate;

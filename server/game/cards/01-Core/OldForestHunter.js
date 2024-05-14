const DrawCard = require('../../drawcard.js');

class OldForestHunter extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card to gain 1 gold',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to gain 1 gold',
                    this.controller,
                    this,
                    context.costs.discardFromHand
                );
            }
        });
    }
}

OldForestHunter.code = '01131';

module.exports = OldForestHunter;

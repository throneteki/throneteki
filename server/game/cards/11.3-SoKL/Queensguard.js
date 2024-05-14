const DrawCard = require('../../drawcard.js');

class Queensguard extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ not: { trait: 'Lady' } });
        this.action({
            title: 'Stand attached character',
            condition: () => this.parent.kneeled,
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perRound(3),
            handler: (context) => {
                context.player.standCard(this.parent);
                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to stand {3}',
                    context.player,
                    this,
                    context.costs.discardFromHand,
                    this.parent
                );
            }
        });
    }
}

Queensguard.code = '11054';

module.exports = Queensguard;

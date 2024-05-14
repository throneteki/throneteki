const DrawCard = require('../../drawcard.js');

class TheTitansBastard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return a Mercenary',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.player &&
                    card.hasTrait('Mercenary') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                context.player.moveCard(context.target, 'hand');
                this.game.addMessage(
                    '{0} kneels {1} to move {2} from their discard pile to their hand',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

TheTitansBastard.code = '15010';

module.exports = TheTitansBastard;

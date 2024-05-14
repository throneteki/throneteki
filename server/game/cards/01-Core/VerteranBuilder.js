const DrawCard = require('../../drawcard.js');

class VerteranBuilder extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a location',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} sacrifices {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );

                context.player.standCard(context.target);
            }
        });
    }
}

VerteranBuilder.code = '01134';

module.exports = VerteranBuilder;

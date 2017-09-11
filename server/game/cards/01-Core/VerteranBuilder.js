const DrawCard = require('../../drawcard.js');

class VerteranBuilder extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a location',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'location'
            },
            handler: context => {
                let player = context.player;
                let card = context.target;

                this.game.addMessage('{0} sacrifices {1} to stand {2}', player, this, card);

                player.standCard(card);
            }
        });
    }
}

VerteranBuilder.code = '01134';

module.exports = VerteranBuilder;

const DrawCard = require('../../drawcard.js');

class MaesterCressen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to discard condition',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: card => card.location === 'play area' && card.getType() === 'attachment' && card.hasTrait('condition')
            },
            handler: context => {
                let player = context.player;
                let card = context.target;
                player.discardCard(card);

                this.game.addMessage('{0} uses {1} to discard {2}', player, this, card);
            }
        });
    }
}

MaesterCressen.code = '01046';

module.exports = MaesterCressen;

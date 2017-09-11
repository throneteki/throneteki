const DrawCard = require('../../drawcard.js');

class MagisterIllyrio extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a character',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.payGold(2),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                let player = context.player;
                let card = context.target;

                this.game.addMessage('{0} uses {1} to pay 2 gold and stand {2}', player, this, card);

                player.standCard(card);
            }
        });
    }
}

MagisterIllyrio.code = '01163';

module.exports = MagisterIllyrio;

const DrawCard = require('../../drawcard.js');

class AntlerMen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerMoved: event => event.target.getType() === 'faction' && event.target.controller === this.controller
            },
            limit: ability.limit.perRound(2),
            handler: context => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
            }
        });
    }
}

AntlerMen.code = '22002';

module.exports = AntlerMen;

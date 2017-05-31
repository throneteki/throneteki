const DrawCard = require('../../../drawcard.js');

class DornishFiefdom extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let gold = !this.controller.firstPlayer ? 2 : 1;
                this.game.addGold(context.player, gold);
                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

DornishFiefdom.code = '06056';

module.exports = DornishFiefdom;

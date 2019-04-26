const DrawCard = require('../../drawcard.js');

class Arry extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card',
            cost: ability.costs.returnSelfToHand(),
            condition: () => this.controller.canDraw(),
            handler: context => {
                context.player.drawCardsToHand(1);

                this.game.addMessage('{0} returns {1} to their hand and draws 1 card', context.player, this);
            }
        });
    }
}

Arry.code = '04006';
Arry.TODO = 'Does not sacrifice Arry if you control Arya';

module.exports = Arry;

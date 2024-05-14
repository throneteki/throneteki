const DrawCard = require('../../drawcard.js');

class Arry extends DrawCard {
    setupCardAbilities(ability) {
        // TODO: If you control Arya, sacrifice Arry.
        this.action({
            title: 'Draw 1 card',
            cost: ability.costs.returnSelfToHand(),
            condition: () => this.controller.canDraw(),
            handler: (context) => {
                context.player.drawCardsToHand(1);

                this.game.addMessage(
                    '{0} returns {1} to their hand and draws 1 card',
                    context.player,
                    this
                );
            }
        });
    }
}

Arry.code = '04006';

module.exports = Arry;

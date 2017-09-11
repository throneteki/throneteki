const DrawCard = require('../../drawcard.js');

class MessengerRaven extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card',
            phase: 'dominance',
            cost: ability.costs.returnSelfToHand(),
            handler: context => {
                let player = context.player;

                player.drawCardsToHand(1);

                this.game.addMessage('{0} returns {1} to their hand and draws 1 card', player, this);
            }
        });
    }
}

MessengerRaven.code = '01130';

module.exports = MessengerRaven;

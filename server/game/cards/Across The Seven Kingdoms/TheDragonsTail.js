const DrawCard = require('../../drawcard.js');

class TheDragonsTail extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Both you and opponent draw 2 cards',
            chooseOpponent: true,
            handler: context => {
                let opponent = context.opponent;

                this.controller.drawCardsToHand(2);
                opponent.drawCardsToHand(2);

                this.game.addMessage('{0} uses {1} to make both themself and {2} draw 2 cards',
                    this.controller, this, opponent);
            }
        });
    }
}

TheDragonsTail.code = '04001';

module.exports = TheDragonsTail;

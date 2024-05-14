const DrawCard = require('../../drawcard.js');

class TheDragonsTail extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Both you and opponent draw 2 cards',
            chooseOpponent: true,
            handler: (context) => {
                let opponent = context.opponent;

                if (this.controller.canDraw()) {
                    this.controller.drawCardsToHand(2);
                }
                if (opponent.canDraw()) {
                    opponent.drawCardsToHand(2);
                }

                this.game.addMessage(
                    '{0} uses {1} to make both themself and {2} draw 2 cards',
                    this.controller,
                    this,
                    opponent
                );
            }
        });
    }
}

TheDragonsTail.code = '17147';

module.exports = TheDragonsTail;

const DrawCard = require('../../drawcard.js');

class FishmongersSquare extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card and gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            condition: () => this.opponentDiscardPileHas10(),
            handler: context => {
                if(context.player.canDraw()) {
                    context.player.drawCardsToHand(1);
                }
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} kneels {1} to draw 1 card and gain 1 gold', context.player, this);
            }
        });
    }

    opponentDiscardPileHas10() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some(opponent => opponent.discardPile.length >= 10);
    }
}

FishmongersSquare.code = '13112';

module.exports = FishmongersSquare;

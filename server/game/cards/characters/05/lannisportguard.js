const DrawCard = require('../../../drawcard.js');

class LannisportGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (e, card) => card === this && this.game.currentPhase === 'marshal'
            },
            handler: () => {
                player.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to have each player draw a card', this.controller, this);
            }
        });
    }
}

LannisportGuard.code = '05016';

module.exports = LannisportGuard;

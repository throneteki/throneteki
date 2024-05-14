const DrawCard = require('../../drawcard.js');

class LannisportGuard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                for (let player of this.game.getPlayers()) {
                    if (player.canDraw()) {
                        player.drawCardsToHand(1);
                    }
                }

                this.game.addMessage(
                    '{0} uses {1} to have each player draw a card',
                    this.controller,
                    this
                );
            }
        });
    }
}

LannisportGuard.code = '05016';

module.exports = LannisportGuard;

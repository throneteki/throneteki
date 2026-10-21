import DrawCard from '../../drawcard.js';

class LannisportGuard extends DrawCard {
    // Lannisport Guard (05016)
    // Reaction: After you marshal Lannisport Guard, each player draws 1 card.
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

export default LannisportGuard;

import DrawCard from '../../drawcard.js';

class TheQueensRetinue extends DrawCard {
    // The Queen's Retinue (13103)
    // Shadow (4).
    // Action: Put The Queen's Retinue into play from shadows. Then, each opponent draws 2 cards.
    setupCardAbilities() {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            handler: (context) => {
                context.player.putIntoPlay(this);
                for (let opponent of this.game.getOpponents(this.controller)) {
                    if (opponent.canDraw()) {
                        opponent.drawCardsToHand(2);
                    }
                }
                this.game.addMessage(
                    '{0} uses {1} to put {1} into play from shadows and have each opponent draw 2 cards',
                    this.controller,
                    this
                );
            }
        });
    }
}

TheQueensRetinue.code = '13103';

export default TheQueensRetinue;

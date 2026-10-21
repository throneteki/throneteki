import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class SixMaidsInAPool extends DrawCard {
    // "Six Maids in a Pool" (09023)
    // Action: Draw 1 card for each Lady character you control.
    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            condition: () => this.controller.canDraw(),
            handler: () => {
                let cards = this.controller.getNumberOfCardsInPlay(
                    (card) => card.hasTrait('Lady') && card.getType() === 'character'
                );
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage(
                    '{0} plays {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

SixMaidsInAPool.code = '09023';

export default SixMaidsInAPool;

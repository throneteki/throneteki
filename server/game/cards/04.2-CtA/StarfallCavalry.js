import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class StarfallCavalry extends DrawCard {
    // Starfall Cavalry (04035)
    // No attachments except Weapon.
    // Reaction: After Starfall Cavalry enters play, draw 1 card. (3 cards instead if there are 3 or
    // more plot cards in your used pile.)
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.controller.canDraw()
            },
            handler: () => {
                let cards = this.controller.getNumberOfUsedPlots() >= 3 ? 3 : 1;
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

StarfallCavalry.code = '04035';

export default StarfallCavalry;

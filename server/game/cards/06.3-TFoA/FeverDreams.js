import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class FeverDreams extends DrawCard {
    // Fever Dreams (06050)
    // Opponent's character only. Bestow (3).
    // Reaction: After attached character is knelt, discard 1 gold from Fever Dreams to draw 2
    // cards.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                onCardKneeled: (event) => event.card === this.parent && this.controller.canDraw()
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} discards a gold from {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

FeverDreams.code = '06050';

export default FeverDreams;

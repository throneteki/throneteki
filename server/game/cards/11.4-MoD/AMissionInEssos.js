import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class AMissionInEssos extends DrawCard {
    // A Mission in Essos (11076)
    // Shadow (2).
    // Action: Remove all but the bottom card of your deck from the game facedown. Then, shuffle
    // your discard pile into your deck and draw 3 cards.
    setupCardAbilities() {
        this.action({
            title: 'Remove deck from game',
            handler: () => {
                let deck = this.controller.drawDeck.slice(0, -1);
                for (let card of deck) {
                    this.controller.moveCard(card, 'out of game');
                    card.facedown = true;
                }

                for (let card of this.controller.discardPile) {
                    this.controller.moveCard(card, 'draw deck');
                }

                this.controller.shuffleDrawDeck();
                let cardsDrawn = this.controller.drawCardsToHand(3);
                this.game.addMessage(
                    '{0} uses {1} to replace their deck with their discard pile, shuffle it, and draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cardsDrawn.length, 'card')
                );
            }
        });
    }
}

AMissionInEssos.code = '11076';

export default AMissionInEssos;

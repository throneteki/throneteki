const DrawCard = require('../../drawcard');

class BurningTheDead extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove dead from game and draw 1',
            handler: () => {
                let cardsToRemove = this.game.allCards.filter(
                    (card) =>
                        card.location === 'dead pile' &&
                        card.getType() === 'character' &&
                        !card.isUnique()
                );
                for (let card of cardsToRemove) {
                    card.owner.removeCardFromGame(card, false);
                }
                let numOfCardsDrawn = this.controller.drawCardsToHand(1).length;
                this.game.addMessage(
                    '{0} plays {1} to remove each non-unique character in the dead pile from the game and draw {2} card',
                    this.controller,
                    this,
                    numOfCardsDrawn
                );
            }
        });
    }
}

BurningTheDead.code = '11019';

module.exports = BurningTheDead;

import GameActions from '../GameActions/index.js';

class RemoveFromGameCost {
    constructor() {
        this.name = 'removeFromGame';
    }

    isEligible(card) {
        return card.location !== 'out of game' && GameActions.removeFromGame({ card }).allow();
    }

    pay(cards) {
        for (let card of cards) {
            card.owner.moveCard(card, 'out of game');
        }
    }
}

export default RemoveFromGameCost;

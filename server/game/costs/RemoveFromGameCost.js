import GameActions from '../GameActions/index.js';

class RemoveFromGameCost {
    constructor() {
        this.name = 'removeFromGame';
    }

    isEligible(card) {
        return card.location !== 'out of game' && GameActions.removeFromGame({ card }).allow();
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map((card) => GameActions.removeFromGame({ card, allowSave: false }))
            ),
            context
        );
    }
}

export default RemoveFromGameCost;

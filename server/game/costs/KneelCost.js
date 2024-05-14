import GameActions from '../GameActions/index.js';

class KneelCost {
    constructor() {
        this.name = 'kneel';
    }

    isEligible(card) {
        return GameActions.kneelCard({ card }).allow();
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map((card) => GameActions.kneelCard({ card, reason: 'cost' }))
            )
        );
    }
}

export default KneelCost;

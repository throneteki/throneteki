import GameActions from '../GameActions/index.js';

class StandCost {
    constructor() {
        this.name = 'stand';
    }

    isEligible(card) {
        return GameActions.standCard({ card }).allow();
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(cards.map((card) => GameActions.standCard({ card })))
        );
    }
}

export default StandCost;

import GameActions from '../GameActions/index.js';

class PutIntoPlayCost {
    constructor() {
        this.name = 'putIntoPlay';
    }

    isEligible(card, context) {
        return GameActions.putIntoPlay({ player: context.player, card }).allow(context);
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map((card) =>
                    GameActions.putIntoPlay({ player: context.player, card, dupeIsValid: true })
                )
            ),
            context
        );
    }
}

export default PutIntoPlayCost;

const GameActions = require('../GameActions');

class PlaceOnBottomCost {
    constructor() {
        this.name = 'placeBottom';
    }

    isEligible(card) {
        return card.location === 'hand';
    }

    pay(cards, context) {
        context.game.addMessage('{0} reveals {1} from their hand and places it on the bottom of their deck', context.player, cards);
        context.game.resolveGameAction(
            GameActions.simultaneously(context => cards.map(card => (
                GameActions.placeCard({ player: context.player, card, location: 'draw deck', bottom: true }))
            )),
            context
        );
    }
}

module.exports = PlaceOnBottomCost;

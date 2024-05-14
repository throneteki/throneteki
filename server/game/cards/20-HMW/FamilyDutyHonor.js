import DrawCard from '../../drawcard.js';

class FamilyDutyHonor extends DrawCard {
    setupCardAbilities(ability) {
        let leftPlayCondition = (event) =>
            event.allowSave &&
            event.card.canBeSaved() &&
            event.card.hasTrait('House Tully') &&
            event.card.controller === this.controller &&
            event.card.getPower() > 0;
        this.interrupt({
            when: {
                onCharacterKilled: leftPlayCondition,
                onCardDiscarded: leftPlayCondition,
                onCardReturnedToHand: leftPlayCondition,
                onCardRemovedFromGame: leftPlayCondition,
                onCardReturnedToDeck: leftPlayCondition,
                onCardPutIntoShadows: leftPlayCondition
            },
            cost: ability.costs.discardPower(1, (card, context) => card === context.event.card),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} plays {1} and discards 1 power from {2} to save it',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

FamilyDutyHonor.code = '20029';

export default FamilyDutyHonor;

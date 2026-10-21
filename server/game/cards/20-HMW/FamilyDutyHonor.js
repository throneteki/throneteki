import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FamilyDutyHonor extends DrawCard {
    // Family, Duty, Honor (20029)
    // Interrupt: When a House Tully character you control would leave play, discard 1 power from
    // that character to save it.
    setupCardAbilities(ability) {
        let leftPlayCondition = (event) =>
            event.allowSave &&
            event.card.canBeSaved() &&
            event.card.hasTrait('House Tully') &&
            event.card.controller === this.controller &&
            event.card.getPower() > 0;
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: leftPlayCondition,
                onCardDiscarded: leftPlayCondition,
                onCardReturnedToHand: leftPlayCondition,
                onCardRemovedFromGame: leftPlayCondition,
                onCardReturnedToDeck: leftPlayCondition,
                onCardPutIntoShadows: leftPlayCondition
            },
            cost: ability.costs.discardPower(1, (card, context) => card === context.event.card),
            message: {
                format: '{player} plays {source} and discards 1 power from {card} to save it',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

FamilyDutyHonor.code = '20029';

export default FamilyDutyHonor;

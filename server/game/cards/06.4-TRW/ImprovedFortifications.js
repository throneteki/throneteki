import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ImprovedFortifications extends DrawCard {
    // Improved Fortifications (06066)
    // Location only.
    // Interrupt: When attached location would leave play, sacrifice Improved Fortifications to save
    // it.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location' });

        let leftPlayCondition = (event) =>
            event.allowSave && event.card.canBeSaved() && event.card === this.parent;
        this.interrupt({
            canCancel: true,
            when: {
                onCardDiscarded: leftPlayCondition,
                onCardReturnedToHand: leftPlayCondition,
                onCardRemovedFromGame: leftPlayCondition,
                onCardReturnedToDeck: leftPlayCondition,
                onCardPutIntoShadows: leftPlayCondition
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to save {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

ImprovedFortifications.code = '06066';

export default ImprovedFortifications;

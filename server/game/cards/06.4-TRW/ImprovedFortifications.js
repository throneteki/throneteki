import DrawCard from '../../drawcard.js';

class ImprovedFortifications extends DrawCard {
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
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} sacrifices {1} to save {2}',
                    context.player,
                    this,
                    this.parent
                );
            }
        });
    }
}

ImprovedFortifications.code = '06066';

export default ImprovedFortifications;

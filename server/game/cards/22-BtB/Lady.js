import DrawCard from '../../drawcard.js';

class Lady extends DrawCard {
    setupCardAbilities(ability) {
        let leftPlayCondition = (event) =>
            event.allowSave &&
            event.card.canBeSaved() &&
            event.card !== this &&
            (event.card.hasTrait('Direwolf') || event.card.name === 'Sansa Stark');
        this.interrupt({
            when: {
                onCharacterKilled: leftPlayCondition,
                onCardDiscarded: leftPlayCondition,
                onCardReturnedToHand: leftPlayCondition,
                onCardRemovedFromGame: leftPlayCondition,
                onCardReturnedToDeck: leftPlayCondition,
                onCardPutIntoShadows: leftPlayCondition
            },
            cost: ability.costs.killSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} kills {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

Lady.code = '22017';

export default Lady;

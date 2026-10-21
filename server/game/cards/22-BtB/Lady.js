import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Lady extends DrawCard {
    // Lady (22017)
    // No attachments.
    // Interrupt: When another Direwolf card or Sansa Stark would leave play, kill Lady to save that
    // card.
    setupCardAbilities(ability) {
        let leftPlayCondition = (event) =>
            event.allowSave &&
            event.card.canBeSaved() &&
            event.card !== this &&
            (event.card.hasTrait('Direwolf') || event.card.name === 'Sansa Stark');
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
            cost: ability.costs.killSelf(),
            message: {
                format: '{player} kills {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

Lady.code = '22017';

export default Lady;

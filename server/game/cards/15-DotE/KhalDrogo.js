import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KhalDrogo extends DrawCard {
    // Khal Drogo (15005)
    // Renown.
    // Interrupt: When an Army or Dothraki character would be returned to your hand, discard 1 card
    // from your hand to save it.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardReturnedToHand: (event, context) =>
                    event.allowSave &&
                    event.card.getType() === 'character' &&
                    (event.card.hasTrait('Army') || event.card.hasTrait('Dothraki')) &&
                    event.card.location === 'play area' &&
                    event.card.owner === context.source.controller //check for owner of the returned card in case dothraki/army card got stolen by the opponent
            },
            cost: ability.costs.discardFromHand(),
            message: {
                format: '{player} uses {source} and discards {discardedCard} from their hand to save {card}',
                args: {
                    discardedCard: (context) => context.costs.discardFromHand,
                    card: (context) => context.event.card
                }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

KhalDrogo.code = '15005';

export default KhalDrogo;

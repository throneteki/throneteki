const DrawCard = require('../../drawcard.js');

class KhalDrogo extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardReturnedToHand: (event) =>
                    event.allowSave &&
                    event.card.getType() === 'character' &&
                    (event.card.hasTrait('Army') || event.card.hasTrait('Dothraki')) &&
                    event.card.location === 'play area' &&
                    event.card.owner === this.controller //check for owner of the returned card in case dothraki/army card got stolen by the opponent
            },
            cost: ability.costs.discardFromHand(),
            message: {
                format: '{player} uses {source} and discards {discardedCard} from their hand to save {card}',
                args: {
                    discardedCard: (context) => context.costs.discardFromHand,
                    card: (context) => context.event.card
                }
            },
            handler: (context) => {
                context.event.saveCard();
            }
        });
    }
}

KhalDrogo.code = '15005';

module.exports = KhalDrogo;

const DrawCard = require('../../drawcard.js');

class KhalDrogo extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardReturnedToHand: event => 
                    event.allowSave &&
                    event.card.getType() === 'character' &&
                    (event.card.hasTrait('Army') || event.card.hasTrait('Dothraki')) &&
                    event.card.owner === this.controller //check for owner of the returned card in case dothraki/army card got stolen by the opponent

            },
            cost: ability.costs.discardFromHand(),
            handler: context => {
                context.event.saveCard();
                this.game.addMessage('{0} discards {1} from their hand to save {2}', this.controller, context.costs.discardFromHand, context.event.target);
            }
        });
    }
}

KhalDrogo.code = '15005';

module.exports = KhalDrogo;

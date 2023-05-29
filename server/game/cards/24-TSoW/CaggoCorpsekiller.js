const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class CaggoCorpsekiller extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardReturnedToHand: event => this.returnConditions(event),
                onCardPutIntoShadows: event => this.returnConditions(event)
            },
            cost: ability.costs.returnSelfToHand(),
            message: {
                format: '{player} returns {costs.returnToHand} to place {card} in it\'s owners dead pile instead of their {targetLocation}',
                args: {
                    card: context => context.event.card,
                    targetLocation: context => context.event.location === 'shadows' ? 'shadow area' : context.event.location
                }
            },
            handler: context => {
                context.event.replaceHandler(() => {
                    this.game.resolveGameAction(GameActions.placeCard(context => ({ card: context.event.card, location: 'dead pile' })), context);
                });
            }
        });
    }

    returnConditions(event) {
        // Cards being "returned" to hand/shadows can only come from 'play area' (TO BE CONFIRMED)
        return event.card !== this && event.card.location === 'play area' && event.card.getType() === 'character';
    }
}

CaggoCorpsekiller.code = '24011';

module.exports = CaggoCorpsekiller;

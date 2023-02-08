const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class CaggoCorpsekiller extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardReturnedToHand: event => event.card.getType() === 'character',
                onCardPutIntoShadows: event => event.card.getType() === 'character'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to place {card} in it\'s owners dead pile',
                args: { card: context => context.event.card }
            },
            handler: context => {
                context.event.replaceHandler(() => {
                    this.game.resolveGameAction(GameActions.placeCard(context => ({ card: context.event.card, location: 'dead pile' })), context);
                });
            }
        });
    }
}

CaggoCorpsekiller.code = '24011';

module.exports = CaggoCorpsekiller;

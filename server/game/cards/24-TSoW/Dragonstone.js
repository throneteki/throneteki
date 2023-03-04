const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Dragonstone extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPutIntoShadows: event => event.card.location === 'play area',
            },
            message: {
                format: '{player} returns {source} to shadows to discard {card}',
                args: { card: context => context.event.card }
            },
            cost: ability.costs.putSelfIntoShadows(),
            gameAction: GameActions.discardCard(context => ({ card: context.event.card, source: this }))
        });
    }
}

Dragonstone.code = '24003';

module.exports = Dragonstone;

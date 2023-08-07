const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Nightfall extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: card => card.hasTrait('House Harlaw'),
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                'onCardDiscarded': event => event.source === 'reserve' && event.card.controller !== this.controller && ['attachment', 'location'].includes(event.card.getType())
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrfices {costs.sacrifice} to put {card} into play under their control',
                args: { card: context => context.event.card }
            },
            gameAction: GameActions.putIntoPlay(context => ({
                card: context.event.card,
                player: this.controller
            }))
        });
    }
}

Nightfall.code = '25522';
Nightfall.version = '1.0';

module.exports = Nightfall;

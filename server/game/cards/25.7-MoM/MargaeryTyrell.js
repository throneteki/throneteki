const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardRevealed: event => event.card.isFaction('tyrell')
                    && event.card.controller === this.controller
                    && ['hand', 'draw deck'].includes(event.card.location)
            },
            limit: ability.limit.perRound(2),
            message: {
                format: '{player} uses {source} to place {card} in shadows',
                args: { card: context => context.event.card }
            },
            gameAction: GameActions.placeCard(context => ({ card: context.event.card, location: 'shadows' }))
        });
    }
}

MargaeryTyrell.code = '25585';
MargaeryTyrell.version = '1.1';

module.exports = MargaeryTyrell;

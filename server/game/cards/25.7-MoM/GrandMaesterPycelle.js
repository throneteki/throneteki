const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class GrandMaesterPycelle extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardDiscarded: event => event.originalLocation === 'hand'
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} to place a discarded card facedown under {controller}\'s agenda instead of placing it in their discard pile',
                args: { controller: context => context.event.card.controller }
            },
            gameAction: GameActions.placeCard(context => ({ card: context.event.card, player: context.event.card.controller, location: 'conclave' }))
        });
    }
}

GrandMaesterPycelle.code = '25526';
GrandMaesterPycelle.version = '1.0';

module.exports = GrandMaesterPycelle;

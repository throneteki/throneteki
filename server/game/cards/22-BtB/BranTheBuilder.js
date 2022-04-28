const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class BranTheBuilder extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller
            },
            limit: ability.limit.perPhase(2),
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select a card',
                match: { type: 'location' },
                message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BranTheBuilder.code = '22029';

module.exports = BranTheBuilder;

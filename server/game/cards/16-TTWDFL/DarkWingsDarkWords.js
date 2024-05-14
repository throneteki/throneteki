const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');

class DarkWingsDarkWords extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event) => event.player === this.controller
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                amount: 1,
                player: context.player
            })),
            limit: ability.limit.perRound(3)
        });
    }
}

DarkWingsDarkWords.code = '16028';

module.exports = DarkWingsDarkWords;

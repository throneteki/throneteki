const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');

class DarkWingsDarkWords extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: event => event.player === this.controller && this.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.drawCards(context => ({
                        amount: 1,
                        player: context.player
                    })),
                    context
                );
            },
            limit: ability.limit.perRound(3)
        });
    }
}

DarkWingsDarkWords.code = '16028';

module.exports = DarkWingsDarkWords;

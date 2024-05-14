const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');

class TheLongVoyage extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardsDrawn: (event) =>
                    event.player === this.controller && event.reason === 'drawPhase'
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} uses {source} and kneels their faction card to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                amount: 1,
                player: context.player
            }))
        });
    }
}

TheLongVoyage.code = '16030';

module.exports = TheLongVoyage;

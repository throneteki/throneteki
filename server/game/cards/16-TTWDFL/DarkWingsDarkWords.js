import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class DarkWingsDarkWords extends AgendaCard {
    // Dark Wings, Dark Words (16028)
    // Your minimum deck size is 75 cards. You cannot include more than 1 copy of each event in your
    // deck.
    // Reaction: After you play an event, draw 1 card. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => event.player === context.source.controller
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

export default DarkWingsDarkWords;

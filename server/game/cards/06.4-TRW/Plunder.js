import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Plunder extends DrawCard {
    // Plunder (06072)
    // Action: Kneel your faction card to choose an opponent. Gain 1 gold for each location and
    // attachment in that player's discard pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            cost: ability.costs.kneelFactionCard(),
            chooseOpponent: (opponent) => plunderedGold(opponent) >= 1,
            message: {
                format: '{player} plays {source} and kneels their faction card to choose {opponent} and gain {gold} gold',
                args: { gold: (context) => plunderedGold(context.opponent) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: plunderedGold(context.opponent)
            }))
        });
    }
}

function plunderedGold(opponent) {
    return opponent.discardPile.filter((card) =>
        ['location', 'attachment'].includes(card.getType())
    ).length;
}

Plunder.code = '06072';

export default Plunder;

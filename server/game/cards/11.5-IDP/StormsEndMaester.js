import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StormsEndMaester extends DrawCard {
    // Storm's End Maester (11087)
    // Challenges Action: Kneel Storm's End Maester to choose an opponent. If you have more power on
    // your faction card than that player, draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (opponent, context) =>
                context.player.faction.power > opponent.faction.power,
            message: '{player} kneels {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

StormsEndMaester.code = '11087';

export default StormsEndMaester;

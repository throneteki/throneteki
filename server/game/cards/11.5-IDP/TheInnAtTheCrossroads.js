import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheInnAtTheCrossroads extends DrawCard {
    // The Inn at the Crossroads (11098)
    // Shadow (1).
    // Dominance Action: Kneel The Inn at the Crossroads to draw 3 cards and choose an opponent.
    // Give control of The Inn at the Crossroads to that player.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 3 cards',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            message:
                '{player} kneels {source} to draw 3 cards and give control of {source} to {opponent}',
            gameAction: GameActions.simultaneously([
                GameActions.drawCards((context) => ({ player: context.player, amount: 3 })),
                GameActions.takeControl((context) => ({
                    player: context.opponent,
                    card: context.source
                }))
            ])
        });
    }
}

TheInnAtTheCrossroads.code = '11098';

export default TheInnAtTheCrossroads;

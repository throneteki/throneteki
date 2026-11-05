import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWatcherOnTheWalls extends DrawCard {
    // The Watcher on the Walls (02066)
    // Play only during a [military] challenge.
    // Challenges Action: Kneel 2 Ranger characters to kill each attacking character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel 2 Rangers to kill attackers',
            phase: 'challenge',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelMultiple(
                2,
                (card) => card.getType() === 'character' && card.hasTrait('Ranger')
            ),
            message: '{player} plays {source} to kill each attacking character',
            gameAction: GameActions.simultaneously((context) =>
                context.game.currentChallenge.attackers.map((card) => GameActions.kill({ card }))
            )
        });
    }
}

TheWatcherOnTheWalls.code = '02066';

export default TheWatcherOnTheWalls;

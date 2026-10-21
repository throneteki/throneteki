import DrawCard from '../../drawcard.js';

class TheWatcherOnTheWalls extends DrawCard {
    // The Watcher on the Walls (02066)
    // Play only during a [military] challenge.
    // Challenges Action: Kneel 2 Ranger characters to kill each attacking character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel 2 Rangers to kill attackers',
            phase: 'challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelMultiple(
                2,
                (card) => card.getType() === 'character' && card.hasTrait('Ranger')
            ),
            handler: () => {
                this.game.killCharacters(this.game.currentChallenge.attackers);
                this.game.addMessage(
                    '{0} uses {1} to kill each attacking character',
                    this.controller,
                    this
                );
            }
        });
    }
}

TheWatcherOnTheWalls.code = '02066';

export default TheWatcherOnTheWalls;

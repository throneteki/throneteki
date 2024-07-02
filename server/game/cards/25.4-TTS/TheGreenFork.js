import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheGreenFork extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        by5: true,
                        challengeType: 'intrigue'
                    })
            },
            location: 'discard pile',
            message: '{player} uses {source} to put {source} into play from their discard pile',
            gameAction: GameActions.putIntoPlay({ card: this })
        });
    }
}

TheGreenFork.code = '25078';

export default TheGreenFork;

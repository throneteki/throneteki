import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheGreenFork extends DrawCard {
    // The Green Fork (25078)
    // Reaction: After you win an [intrigue] challenge by 5 or more STR, put The Green Fork into
    // play from your discard pile.
    // +1 Income.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
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

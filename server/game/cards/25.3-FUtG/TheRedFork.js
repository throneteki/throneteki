import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheRedFork extends DrawCard {
    // The Red Fork (25058)
    // Reaction: After you win a [military] challenge by 5 or more STR, put The Red Fork into play
    // from your discard pile.
    // +2 Initiative.
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 2
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        by5: true,
                        challengeType: 'military'
                    })
            },
            location: 'discard pile',
            message: '{player} uses {source} to put {source} into play from their discard pile',
            gameAction: GameActions.putIntoPlay({ card: this })
        });
    }
}

TheRedFork.code = '25058';

export default TheRedFork;

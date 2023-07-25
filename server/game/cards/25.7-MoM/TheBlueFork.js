const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TheBlueFork extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 2
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, by5: true, challengeType: 'power' })
            },
            location: 'discard pile',
            message: '{player} uses {source} to put {source} into play from their discard pile',
            gameAction: GameActions.putIntoPlay({ card: this })
        });
    }
}

TheBlueFork.code = '25603';
TheBlueFork.version = '1.0';

module.exports = TheBlueFork;

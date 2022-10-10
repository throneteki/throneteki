const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class ThisMustBeAnsweredFiercely extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event =>
                    event.challenge.initiatedAgainstPlayer === this.controller && event.challenge.attackers.length >= 3
            },
            message: '{player} plays {source} to search their deck for a Tyrell character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', faction: 'tyrell' },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

ThisMustBeAnsweredFiercely.code = '08104';

module.exports = ThisMustBeAnsweredFiercely;

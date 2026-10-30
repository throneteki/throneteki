import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThisMustBeAnsweredFiercely extends DrawCard {
    // This Must Be Answered Fiercely! (08104)
    // Reaction: After 3 or more characters are declared as attackers in a challenge against you,
    // search your deck for a [tyrell] character and put it into play. Shuffle your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.source.controller &&
                    event.challenge.attackers.length >= 3
            },
            message: '{player} plays {source} to search their deck for a Tyrell character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', faction: 'tyrell' },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

ThisMustBeAnsweredFiercely.code = '08104';

export default ThisMustBeAnsweredFiercely;

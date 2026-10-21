import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Oathkeeper extends DrawCard {
    // Oathkeeper (08005)
    // Attached character gets +2 STR.
    // Reaction: After you win a challenge by 5 or more STR in which attached character is
    // participating, sacrifice Oathkeeper to search your deck for a non-[tyrell] character, reveal
    // it, and add it to your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    event.challenge.isParticipating(this.parent)
            },
            cost: ability.costs.sacrificeSelf(),
            message:
                '{player} sacrifices {costs.sacrifice} to search their deck for a non-Tyrell character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', not: { faction: 'tyrell' } },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Oathkeeper.code = '08005';

export default Oathkeeper;

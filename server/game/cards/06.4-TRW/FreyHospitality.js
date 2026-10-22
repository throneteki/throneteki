import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FreyHospitality extends DrawCard {
    // Frey Hospitality (06079)
    // Reaction: After you win a challenge in which you control an attacking House Frey character,
    // if it was the third challenge you initiated this phase, choose and kill a character
    // controlled by the losing opponent. (Choose and kill 3 characters instead if you won by 20 or
    // more STR.)
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.number === 3 &&
                    event.challenge.attackers.some(
                        (card) =>
                            card.controller === context.player &&
                            card.hasTrait('House Frey') &&
                            card.getType() === 'character'
                    )
            },
            message: {
                format: '{player} plays {source} to kill characters controlled by {loser}',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                mode: 'exactly',
                numCards: (context) => (context.event.challenge.strengthDifference >= 20 ? 3 : 1),
                title: 'Select character(s)',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.event.challenge.loser &&
                    card.getType() === 'character',
                gameAction: (card) => GameActions.kill({ card })
            })
        });
    }
}

FreyHospitality.code = '06079';

export default FreyHospitality;

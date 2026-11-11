import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class GennaFrey extends DrawCard {
    // Genna Frey (06109)
    // Reaction: After you win a challenge in which Genna Frey is attacking, if it was the third
    // challenge you initiated this phase, the losing opponent discards 1 card at random from his or
    // her hand. (2 cards instead if you control another attacking House Frey character.)
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.number === 3 &&
                    event.challenge.isAttacking(context.source)
            },
            message: {
                format: "{player} uses {source} to discard {amount} at random from {loser}'s hand",
                args: {
                    amount: (context) => TextHelper.count(gennaDiscards(context), 'card'),
                    loser: (context) => context.event.challenge.loser
                }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.event.challenge.loser,
                amount: gennaDiscards(context)
            }))
        });
    }
}

function gennaDiscards(context) {
    const otherFrey = context.event.challenge.attackers.some(
        (card) =>
            card !== context.source &&
            card.hasTrait('House Frey') &&
            card.getType() === 'character' &&
            card.controller === context.player
    );
    return otherFrey ? 2 : 1;
}

GennaFrey.code = '06109';

export default GennaFrey;

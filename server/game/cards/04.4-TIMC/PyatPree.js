import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PyatPree extends DrawCard {
    // Pyat Pree (04073)
    // Reaction: After you win a challenge in which Pyat Pree is participating, search the top X
    // cards of your deck for a [targaryen] attachment or event, reveal it, and add it to your hand.
    // Shuffle your deck. X is the STR by which you won the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            message: {
                format: '{player} uses {source} to search the top {numCards} cards of their deck for a Targaryen attachment',
                args: { numCards: (context) => context.game.currentChallenge.strengthDifference }
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { type: ['attachment', 'event'], faction: 'targaryen' },
                topCards: (context) => context.event.challenge.strengthDifference,
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

PyatPree.code = '04073';

export default PyatPree;

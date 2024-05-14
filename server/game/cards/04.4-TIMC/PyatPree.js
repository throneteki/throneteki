import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PyatPree extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
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

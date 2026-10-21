import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class FreeBrothers extends DrawCard {
    // Free Brothers (25013)
    // Reaction: After Free Brothers enters play, search your deck for an Ally character with
    // printed cost 3 or lower and place it in your discard pile. Shuffle your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message:
                '{player} uses {source} to search their deck for an Ally character with printed cost 3 or lower',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { trait: 'Ally', printedCostOrLower: 3 },
                reveal: false,
                message: '{player} places {searchTarget} in their discard pile',
                gameAction: GameActions.placeCard((context) => ({
                    card: context.searchTarget,
                    player: context.player,
                    location: 'discard pile'
                }))
            })
        });
    }
}

FreeBrothers.code = '25013';

export default FreeBrothers;

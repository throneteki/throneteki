import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBlueBard extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for any number of Song events',
            gameAction: GameActions.search({
                title: 'Select any number of events',
                match: { type: 'event', trait: 'Song' },
                topCards: 10,
                numToSelect: 10,
                message: '{player} adds {searchTarget} to their hand',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) => GameActions.addToHand({ card }))
                )
            })
        });
    }
}

TheBlueBard.code = '09010';

export default TheBlueBard;

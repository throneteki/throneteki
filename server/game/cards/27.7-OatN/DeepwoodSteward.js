import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DeepwoodSteward extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a location',
            gameAction: GameActions.search({
                title: 'Select a location',
                topCards: 10,
                match: {
                    type: 'location',
                    or: [{ trait: 'The North' }, { not: { faction: 'baratheon' } }]
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

DeepwoodSteward.code = '27506';
DeepwoodSteward.version = '1.0.0';

export default DeepwoodSteward;

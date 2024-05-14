import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheQueenOfThorns extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: (event) => event.card === this
            },
            cost: ability.costs.discardFromHand((card) => card.getType() === 'event'),
            message:
                '{player} uses {source} and discards {costs.discardFromHand} from their hand to search their deck for an event',
            gameAction: GameActions.search({
                title: 'Select an event',
                match: { type: 'event' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

TheQueenOfThorns.code = '09004';

export default TheQueenOfThorns;

import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BranTheBuilder extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            limit: ability.limit.perPhase(2),
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a location',
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select a card',
                match: { type: 'location' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BranTheBuilder.code = '22029';

export default BranTheBuilder;

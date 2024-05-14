import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheCitadel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for Maesters',
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {costs.kneel} to search the top 10 cards of their deck for a Maester character',
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: { type: 'character', trait: 'Maester' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

TheCitadel.code = '09042';

export default TheCitadel;
